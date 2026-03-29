import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { createEventShow, fetchEvent } from "../../store/event/eventThunk";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { MapPin, Search, Plus, Clock, Navigation, Loader2, Calendar as CalendarIcon, AlertCircle, Repeat, Hash, Timer } from "lucide-react";
import toast from "react-hot-toast";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function LocationPicker({ setLocation }) {
  useMapEvents({ click(e) { setLocation(e.latlng); } });
  return null;
}

function ChangeMapView({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView([coords.lat, coords.lng], 15);
  }, [coords]);
  return null;
}

export default function CreateEventShow() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { eventId } = useParams();

  const { event, loading: eventLoading } = useSelector(state => state.event);
  const { user } = useSelector(state => state.auth);

  const [location, setLocation] = useState(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [venueName, setVenueName] = useState("");
  const [address, setAddress] = useState("");
  const [capacity, setCapacity] = useState("");
  
  const [showType, setShowType] = useState("one-time"); 
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [recurringTimes, setRecurringTimes] = useState([""]); 
  const [oneTimeTimes, setOneTimeTimes] = useState([""]); 

  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (eventId) dispatch(fetchEvent(eventId));
  }, [dispatch, eventId]);

  const searchLocation = async () => {
    if (!search) return;
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json&addressdetails=1`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
    } catch (err) {
        toast.error("Location search failed");
    }
  };

  const selectPlace = (place) => {
    const coords = { lat: parseFloat(place.lat), lng: parseFloat(place.lon) };
    setLocation(coords);
    setVenueName(place.display_name.split(",")[0]);
    setAddress(place.display_name);
    setResults([]);
  };

  const generateRecurringDates = () => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const now = new Date();
    const generatedTimes = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      recurringTimes.forEach(time => {
        if (time) {
          const [hours, minutes] = time.split(':');
          const fullDate = new Date(d);
          fullDate.setHours(parseInt(hours), parseInt(minutes), 0);
          
          if (fullDate > now) {
            generatedTimes.push(fullDate.toISOString());
          }
        }
      });
    }
    return generatedTimes;
  };

  const validateTimes = () => {
    const now = new Date();
    now.setSeconds(0, 0);

    if (showType === "recurring") {
      if (!fromDate || !toDate || recurringTimes.some(t => !t)) {
        return { valid: false, msg: "Please fill in the date range and all daily times." };
      }
      
      const startDateObj = new Date(fromDate);
      startDateObj.setHours(23, 59, 59); // Allow selecting today
      if (startDateObj < now) {
        return { valid: false, msg: "Start date cannot be in the past." };
      }

      if (new Date(fromDate) > new Date(toDate)) {
        return { valid: false, msg: "End date cannot be before start date." };
      }
      return { valid: true };
    }

    if (oneTimeTimes.some(t => !t)) {
      return { valid: false, msg: "Please provide all show dates and times." };
    }

    for (let t of oneTimeTimes) {
      if (new Date(t) < now) {
        return { valid: false, msg: "One-time shows cannot be scheduled in the past." };
      }
    }

    return { valid: true };
  };

  const submit = async () => {
    setFormError(null);
    if (!location) return setFormError("Select a venue on the map.");
    if (!venueName || !capacity) return setFormError("Venue details and capacity are required.");

    const validation = validateTimes();
    if (!validation.valid) return setFormError(validation.msg);

    let finalStartTimes = showType === "recurring" ? generateRecurringDates() : oneTimeTimes;

    if (finalStartTimes.length === 0) {
        return setFormError("No valid future show times generated.");
    }

    setIsSubmitting(true);
    const data = {
      event_id: eventId,
      venue: {
        name: venueName,
        formatted_address: address,
        latitude: location.lat,
        longitude: location.lng
      },
      capacity: capacity,
      start_times: finalStartTimes
    };

    try {
      await dispatch(createEventShow(data)).unwrap();
      toast.success("Shows scheduled!");
      navigate(`/event-layout/${eventId}`);
    } catch (err) {
      toast.error(err || "Failed to create shows");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (eventLoading || !event) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col text-slate-200">
      <Navbar />
      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-[1400px] mx-auto space-y-10">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                Finalize <span className="text-indigo-600">Schedule</span>
              </h1>
              <p className="text-slate-500 font-medium mt-2 uppercase text-[10px] tracking-[0.3em]">
                Event: <span className="text-white">{event.title}</span>
              </p>
            </div>
          </header>

          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-8 bg-slate-900/40 border border-slate-800 rounded-[48px] p-8 shadow-2xl backdrop-blur-sm">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-indigo-500 font-black uppercase text-[10px] tracking-[0.3em]">
                  <MapPin size={16} />
                  <span>Venue Picker</span>
                </div>
                <div className="relative flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && searchLocation()}
                      placeholder="Search for venue location..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-indigo-600 outline-none font-bold text-white placeholder:text-slate-700"
                    />
                  </div>
                  <button onClick={searchLocation} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                    Search
                  </button>
                  {results?.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-[1000] max-h-60 overflow-y-auto">
                      {results.map((r, i) => (
                        <div key={i} onClick={() => selectPlace(r)} className="p-4 border-b border-slate-800 hover:bg-indigo-600/10 cursor-pointer text-sm font-medium transition-colors text-slate-300">
                          {r.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="rounded-[32px] overflow-hidden border-4 border-slate-950 shadow-2xl h-[400px]">
                  <MapContainer center={[20.5937, 78.9629]} zoom={5} className="h-full w-full z-0">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationPicker setLocation={setLocation} />
                    <ChangeMapView coords={location} />
                    {location && <Marker position={[location.lat, location.lng]} />}
                  </MapContainer>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 rounded-[48px] p-8 md:p-10 shadow-2xl backdrop-blur-sm space-y-8">
              <div className="flex items-center gap-2 text-indigo-500 font-black uppercase text-[10px] tracking-[0.3em]">
                <Navigation size={16} />
                <span>Show Configuration</span>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Venue Name</label>
                    <input value={venueName} onChange={(e) => setVenueName(e.target.value)} className="w-full mt-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 outline-none font-bold text-sm text-white" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Capacity</label>
                    <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="w-full mt-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 outline-none font-bold text-sm text-white" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Show Frequency</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setShowType("one-time")} className={`flex items-center justify-center gap-2 py-4 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all ${showType === 'one-time' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}>
                      <Hash size={14} /> One-Time
                    </button>
                    <button type="button" onClick={() => setShowType("recurring")} className={`flex items-center justify-center gap-2 py-4 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all ${showType === 'recurring' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}>
                      <Repeat size={14} /> Recurring
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800/50">
                  {showType === "one-time" ? (
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Specific Showtimes</label>
                      {oneTimeTimes?.map((t, i) => (
                        <div key={i} className="flex gap-2">
                          <input type="datetime-local" value={t} onChange={(e) => {
                            const updated = [...oneTimeTimes];
                            updated[i] = e.target.value;
                            setOneTimeTimes(updated);
                          }} className="flex-1 bg-slate-950 p-4 rounded-2xl border border-slate-800 outline-none font-bold text-sm text-white [color-scheme:dark]" />
                          {oneTimeTimes.length > 1 && (
                            <button type="button" onClick={() => setOneTimeTimes(oneTimeTimes.filter((_, idx) => idx !== i))} className="px-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-500 transition-all font-bold">&times;</button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => setOneTimeTimes([...oneTimeTimes, ""])} className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-2 hover:text-white transition-colors">
                        <Plus size={14} /> Add Another Showtime
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
                          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 outline-none font-bold text-sm text-white [color-scheme:dark]" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">End Date</label>
                          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 outline-none font-bold text-sm text-white [color-scheme:dark]" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Daily Show Times</label>
                        {recurringTimes?.map((t, i) => (
                          <div key={i} className="flex gap-2">
                            <div className="relative flex-1">
                              <Timer size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                              <input type="time" value={t} onChange={(e) => {
                                const updated = [...recurringTimes];
                                updated[i] = e.target.value;
                                setRecurringTimes(updated);
                              }} className="w-full bg-slate-950 p-4 pl-12 rounded-2xl border border-slate-800 outline-none font-bold text-sm text-white [color-scheme:dark]" />
                            </div>
                            {recurringTimes.length > 1 && (
                              <button type="button" onClick={() => setRecurringTimes(recurringTimes.filter((_, idx) => idx !== i))} className="px-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-500 transition-all font-bold">&times;</button>
                            )}
                          </div>
                        ))}
                        <button type="button" onClick={() => setRecurringTimes([...recurringTimes, ""])} className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-2 hover:text-white transition-colors">
                          <Plus size={14} /> Add Another Time
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {formError && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl">
                  <AlertCircle size={18} className="shrink-0" />
                  <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">{formError}</p>
                </div>
              )}

              <button
                type="button"
                onClick={submit}
                disabled={isSubmitting}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Design Layout"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}