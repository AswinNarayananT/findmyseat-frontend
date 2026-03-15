import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveEvents } from "../../store/event/eventThunk";
import { Calendar, MapPin, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const EventDiscoveryPage = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.event);

  useEffect(() => {
    dispatch(fetchActiveEvents());
  }, [dispatch]);

  if (loading) return <div className="text-center p-20 text-white">Finding amazing events...</div>;

  return (
    <div className="min-h-screen bg-[#020617] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Upcoming Events</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 hover:border-indigo-500 transition-all group">
              <div className="relative h-48">
                <img 
                  src={event.image_url || "/placeholder.jpg"} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  {event.category}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white leading-tight">{event.title}</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <MapPin size={14}/> {event.shows[0]?.venue?.name || "Multiple Venues"}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar size={14}/> {event.shows.length} Show timings available
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <span className="text-indigo-400 font-bold">From ₹{event.base_price}</span>
                  <Link 
                    to={`/booking/event/${event.id}`}
                    className="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-400 hover:text-white transition-all"
                  >
                    {event.entry_type === "seat_wise" ? "Book Seats" : "Get Tickets"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventDiscoveryPage;