import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFullEventDetails } from "../../store/event/eventThunk";
import { 
  Calendar, MapPin, Users, Armchair, Clock, 
  Plus, Edit3, CheckCircle, Scan 
} from "lucide-react";

const EventDetailPage = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { event, loading, error } = useSelector((state) => state.event);

  useEffect(() => {
    if (eventId) dispatch(fetchFullEventDetails(eventId));
  }, [eventId, dispatch]);

  if (loading) return <div className="min-h-screen bg-[#020617] text-white p-10">Loading Event Details...</div>;
  if (!event) return <div className="min-h-screen bg-[#020617] text-white p-10">Event not found.</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <header className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row gap-8 shadow-2xl">
          <img 
            src={event.image_url || "/placeholder-event.jpg"} 
            className="w-full md:w-64 h-64 object-cover rounded-2xl shadow-lg border border-slate-700"
            alt={event.title}
          />
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-black text-white leading-tight">{event.title}</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${event.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {event.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm">{event.description}</p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl text-xs font-bold border border-slate-700/50">
                <MapPin size={14} className="text-indigo-400"/> {event.shows[0]?.venue?.name || "Venue TBD"}
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl text-xs font-bold border border-slate-700/50">
                <Users size={14} className="text-indigo-400"/> Base Price: ₹{event.base_price}
              </div>
            </div>
          </div>
        </header>

        {/* SHOWS & TIMINGS SECTION */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <Clock className="text-indigo-400" /> Event Timings
            </h2>
            <button 
              onClick={() => navigate(`/create-event-show/${eventId}`)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/20"
            >
              <Plus size={18}/> Add Timing
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {event.shows.map((show) => (
              <div key={show.id} className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] flex flex-col sm:flex-row justify-between gap-6 hover:border-indigo-500/30 transition-all group">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Show Schedule</p>
                    <div className="text-white font-black text-xl">
                      {new Date(show.start_time).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-slate-400 text-sm font-bold flex items-center gap-2">
                      <Clock size={16} className="text-slate-600"/> 
                      {new Date(show.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-slate-400 text-sm font-bold flex items-center gap-2">
                      <Users size={16} className="text-slate-600"/> 
                      {show.capacity} Seats
                    </div>
                  </div>

                  {show.seat_layout ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-black border border-emerald-500/20">
                      <CheckCircle size={12}/> LAYOUT READY
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-lg text-[10px] font-black border border-amber-500/20">
                      NO LAYOUT
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 min-w-[140px]">
                  {/* NEW VERIFY BUTTON */}
                  <button 
                    onClick={() => navigate(`/organizer/verify-tickets/${show.id}`)}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                  >
                    <Scan size={16}/> Verify
                  </button>

                  <button 
                    onClick={() => navigate(`/event-layout/${eventId}`)}
                    className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                  >
                    <Armchair size={14}/> {show.seat_layout ? 'Layout' : 'Design'}
                  </button>
                  
                  <button 
                    onClick={() => navigate(`/events/${eventId}/edit-show/${show.id}`)}
                    className="flex items-center justify-center gap-2 bg-transparent hover:bg-slate-800 text-slate-500 hover:text-slate-300 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all"
                  >
                    <Edit3 size={12}/> Edit Show
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EventDetailPage;