import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveEvents } from "../../store/event/eventThunk";
import { Calendar, MapPin, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const EventDiscoveryPage = () => {
  const dispatch = useDispatch();
  // Safe default to an empty array if state is weird
  const { events = [], loading } = useSelector((state) => state.event);

  useEffect(() => {
    dispatch(fetchActiveEvents());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="size-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-indigo-400 font-black uppercase tracking-widest text-xs">Finding amazing events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col text-slate-200">
      <Navbar />

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-[1440px] mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                Upcoming <span className="text-indigo-600">Events</span>
              </h1>
              <p className="text-slate-500 font-medium mt-2">Discover and book the best experiences in town.</p>
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search events..." 
                  className="bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-600 transition-all w-full md:w-64"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events?.map((event) => (
              <div 
                key={event.id} 
                className="bg-slate-900/40 rounded-[32px] overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all group flex flex-col shadow-xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={event.image_url || "/placeholder.jpg"} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.src = "/placeholder.jpg"; }} // Handle broken image links
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60" />
                  <div className="absolute top-4 left-4 bg-indigo-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg">
                    {event.category || "General"}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 space-y-4">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-black text-white leading-tight uppercase tracking-tight group-hover:text-indigo-400 transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                        <MapPin size={14} className="text-indigo-500"/> 
                        {/* FIX: Safe navigation using optional chaining */}
                        <span className="truncate">{event?.shows?.[0]?.venue?.name || "Venue TBD"}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-slate-500 text-xs font-bold">
                        <Calendar size={14} className="text-indigo-500"/> 
                        {event?.shows?.slice(0, 3).map(show => (
                          <span key={show.id} className="bg-slate-800 px-2 py-1 rounded-md text-[10px]">
                            {new Date(show.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        ))}
                        {event?.shows?.length > 3 && (
                          <span className="text-[10px] text-slate-500">+{event.shows.length - 3} more</span>
                        )}
                        {event?.shows?.length === 0 && <span>No upcoming shows</span>}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Starts At</span>
                      <span className="text-white font-black">₹{event.base_price}</span>
                    </div>

                    <Link 
                      to={`/booking/event/${event.id}`}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20"
                    >
                      {event.entry_type === "seat_wise" ? "Book Seats" : "Get Tickets"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!loading && events.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-[40px]">
              <p className="text-slate-500 font-bold">No active events found at the moment.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDiscoveryPage;