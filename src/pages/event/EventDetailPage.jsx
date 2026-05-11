import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFullEventDetails, cancelEventShow, cancelFullEvent } from "../../store/event/eventThunk";
import { 
  Calendar, MapPin, Users, Armchair, Clock, 
  Plus, Edit3, CheckCircle, Scan, Info,
  AlertTriangle, Trash2, Map, Layout
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import toast from "react-hot-toast";

const EventDetailPage = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { event, loading } = useSelector((state) => state.event);
  const [selectedDate, setSelectedDate] = useState(null);
  
  const [cancelModal, setCancelModal] = useState({ show: false, type: null, targetId: null });
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (eventId) dispatch(fetchFullEventDetails(eventId));
  }, [eventId, dispatch]);

  const groupedShows = useMemo(() => {
    if (!event?.shows) return {};
    return event.shows.reduce((acc, show) => {
      const dateKey = new Date(show.start_time).toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(show);
      return acc;
    }, {});
  }, [event]);

  const sortedDates = useMemo(() => Object.keys(groupedShows), [groupedShows]);

  useEffect(() => {
    if (sortedDates.length > 0 && !selectedDate) {
      setSelectedDate(sortedDates[0]);
    }
  }, [sortedDates, selectedDate]);

  const handleCancelAction = async () => {
    if (!cancelReason.trim()) return toast.error("Please provide a reason.");
    
    try {
      if (cancelModal.type === "event") {
        await dispatch(cancelFullEvent({ eventId: cancelModal.targetId, reason: cancelReason })).unwrap();
        toast.success("Event cancelled successfully.");
      } else {
        await dispatch(cancelEventShow({ showId: cancelModal.targetId, reason: cancelReason })).unwrap();
        toast.success("Show cancelled successfully.");
      }
      setCancelModal({ show: false, type: null, targetId: null });
      setCancelReason("");
      dispatch(fetchFullEventDetails(eventId));
    } catch (err) {
      toast.error(err || "Cancellation failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div></div>
        <Footer />
      </div>
    );
  }

  if (!event) return <div className="min-h-screen bg-[#020617] text-white p-10 text-center">Event not found.</div>;

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col text-slate-200 relative">
      <Navbar />

      <main className="flex-1 p-6 md:p-12 selection:bg-indigo-500/30">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <header className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row gap-10 backdrop-blur-md shadow-2xl relative overflow-hidden">
            <div className="shrink-0">
              <img src={event.image_url || "/placeholder-event.jpg"} className="w-full md:w-72 h-72 object-cover rounded-[2.5rem] shadow-2xl border border-slate-700" alt={event.title} />
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-black uppercase text-[10px] tracking-[0.3em]"><Info size={14} /><span>Organizer View</span></div>
                  <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">{event.title}</h1>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg ${event.is_cancelled ? 'bg-red-500/20 text-red-500 border-red-500/30' : event.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {event.is_cancelled ? 'CANCELLED' : event.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {!event.is_cancelled && (
                    <button 
                      onClick={() => setCancelModal({ show: true, type: 'event', targetId: event.id })}
                      className="text-rose-500 hover:text-rose-400 text-[10px] font-black uppercase flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={12}/> Cancel Event
                    </button>
                  )}
                </div>
              </div>
              
              <p className="text-slate-400 leading-relaxed text-base max-w-3xl italic font-medium">
                {event.description}
              </p>

              {/* Main Event Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button 
                  onClick={() => navigate(`/edit-event-location/${eventId}`)}
                  className="flex items-center gap-3 bg-slate-950/50 hover:bg-indigo-600/10 hover:text-indigo-400 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider border border-slate-800/50 transition-all"
                >
                  <Map size={16} className="text-indigo-500"/> Edit Location
                </button>
                <button 
                  onClick={() => navigate(`/event-layout/${eventId}`)}
                  className="flex items-center gap-3 bg-slate-950/50 hover:bg-indigo-600/10 hover:text-indigo-400 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider border border-slate-800/50 transition-all"
                >
                  <Layout size={16} className="text-indigo-500"/> Edit Layout
                </button>
                <button 
                  onClick={() => navigate(`/edit-event-details/${eventId}`)}
                  className="flex items-center gap-3 bg-slate-950/50 hover:bg-indigo-600/10 hover:text-indigo-400 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider border border-slate-800/50 transition-all"
                >
                  <Edit3 size={16} className="text-indigo-500"/> Edit Info
                </button>
              </div>
            </div>
          </header>

          <section className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-800/50 pb-8">
              <div className="space-y-6">
                <h2 className="text-3xl font-black text-white flex items-center gap-4 uppercase tracking-tighter italic">
                  <Clock size={32} className="text-indigo-500" /> Show Timings
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {sortedDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`flex flex-col items-center min-w-[90px] py-4 rounded-3xl border transition-all duration-300 ${
                        selectedDate === date 
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-900/40 translate-y-[-4px]" 
                          : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600"
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">
                        {new Date(date).toLocaleString("en-US", { weekday: "short" })}
                      </span>
                      <span className="text-2xl font-black">{new Date(date).getDate()}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {selectedDate && groupedShows[selectedDate]?.map((show) => (
                <div key={show.id} className={`bg-slate-900/40 border p-8 rounded-[2.5rem] flex flex-col justify-between gap-8 group backdrop-blur-sm relative overflow-hidden transition-all ${show.is_cancelled ? 'border-red-900/50 grayscale' : 'border-slate-800 hover:border-indigo-500/30'}`}>
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Start Time</p>
                        <div className="text-white font-black text-3xl italic tracking-tighter">
                          {new Date(show.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {show.is_cancelled ? (
                         <div className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-full text-[9px] font-black border border-red-500/20 shadow-sm">CANCELLED</div>
                      ) : (
                        <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[9px] font-black border border-emerald-500/20 shadow-sm">ACTIVE</div>
                      )}
                    </div>
                  </div>

                  {!show.is_cancelled ? (
                    <div className="flex flex-col gap-3 z-10">
                      <button 
                        onClick={() => navigate(`/organizer/verify-tickets/${show.id}`)} 
                        className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-indigo-900/20"
                      >
                        <Scan size={18}/> Verify Tickets
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => navigate(`/events/${eventId}/edit-show/${show.id}`)} 
                          className="bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2"
                        >
                          <Edit3 size={14}/> Edit Time
                        </button>
                        <button 
                          onClick={() => setCancelModal({ show: true, type: 'show', targetId: show.id })} 
                          className="bg-slate-800 hover:bg-rose-900/40 text-rose-500 py-3 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2"
                        >
                          <Trash2 size={14}/> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10 text-red-500/60 text-[10px] font-bold italic text-center uppercase tracking-widest">Show Cancelled</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {cancelModal.show && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-4 mb-8">
              <div className="size-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500"><AlertTriangle size={32} /></div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Confirm Cancellation</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Cancelling this {cancelModal.type} will automatically refund all booked users. This cannot be undone.
              </p>
            </div>
            <textarea 
              value={cancelReason} 
              onChange={(e) => setCancelReason(e.target.value)} 
              placeholder="Reason for cancellation..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-rose-500 h-24 mb-6 transition-all"
            />
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setCancelModal({ show: false, type: null, targetId: null })} className="py-4 bg-slate-800 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest">Nevermind</button>
              <button onClick={handleCancelAction} className="py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-950/40">Cancel Now</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EventDetailPage;