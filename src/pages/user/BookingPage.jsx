import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicEventDetails } from "../../store/event/eventThunk";
import { Calendar, MapPin, Clock, Ticket } from "lucide-react";

const BookingPage = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { event, loading } = useSelector((state) => state.event);
  const [selectedShow, setSelectedShow] = useState(null);

  useEffect(() => {
    dispatch(fetchPublicEventDetails(eventId));
  }, [eventId, dispatch]);

  if (loading) return <div className="p-20 text-white">Loading event...</div>;
  if (!event) return <div className="p-20 text-white">Event not found.</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left: Event Details */}
        <div className="lg:col-span-2 space-y-6">
          <img src={event.image_url} className="w-full h-80 object-cover rounded-3xl" alt={event.title} />
          <h1 className="text-4xl font-black">{event.title}</h1>
          <p className="text-slate-400 leading-relaxed">{event.description}</p>
        </div>

        {/* Right: Show Selection Sidebar */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 h-fit space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Ticket className="text-indigo-500" /> Select Timing
          </h2>
          
          <div className="space-y-3">
            {event.shows.map((show) => (
              <div 
                key={show.id}
                onClick={() => setSelectedShow(show)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedShow?.id === show.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950'
                }`}
              >
                <p className="font-bold">{new Date(show.start_time).toLocaleDateString()}</p>
                <p className="text-sm text-slate-500">{new Date(show.start_time).toLocaleTimeString()}</p>
                <p className="text-xs text-indigo-400 mt-2 flex items-center gap-1">
                  <MapPin size={12}/> {show.venue.name}
                </p>
              </div>
            ))}
          </div>

          <button 
            disabled={!selectedShow}
            onClick={() => navigate(`/booking/seats/${selectedShow.id}`)}
            className="w-full py-4 bg-indigo-600 rounded-2xl font-bold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Proceed to Seat Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;