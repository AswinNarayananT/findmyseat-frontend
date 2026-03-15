import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFullEventDetails } from "../../store/event/eventThunk";
import { Calendar, MapPin, Users, Armchair, Clock, Plus, Edit3, CheckCircle } from "lucide-react";

const EventDetailPage = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { event, loading, error } = useSelector((state) => state.event);

  useEffect(() => {
    if (eventId) dispatch(fetchFullEventDetails(eventId));
  }, [eventId, dispatch]);

  if (loading) return <div className="text-white p-10">Loading Event Details...</div>;
  if (!event) return <div className="text-white p-10">Event not found.</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER SECTION: General Event Info */}
        <header className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row gap-8 shadow-2xl">
          <img 
            src={event.image_url || "/placeholder-event.jpg"} 
            className="w-full md:w-64 h-64 object-cover rounded-2xl shadow-lg"
          />
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-black text-white">{event.title}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${event.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {event.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">{event.description}</p>
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl"><MapPin size={16}/> {event.shows[0]?.venue?.name || "Venue TBD"}</div>
              <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl"><Users size={16}/> Base Price: ₹{event.base_price}</div>
            </div>
          </div>
        </header>

        {/* SHOWS & TIMINGS SECTION */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="text-indigo-400" /> Event Timings & Layouts
            </h2>
            <button 
              onClick={() => navigate(`/create-event-show/${eventId}`)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
            >
              <Plus size={18}/> Add New Timing
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.shows.map((show) => (
              <div key={show.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center hover:border-slate-600 transition-all">
                <div className="space-y-1">
                  <div className="text-white font-bold text-lg">
                    {new Date(show.start_time).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </div>
                  <div className="text-slate-400 text-sm flex items-center gap-2">
                    <Clock size={14}/> {new Date(show.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-indigo-400 text-xs font-bold flex items-center gap-1 mt-2">
                    <Users size={12}/> Capacity: {show.capacity}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Status Indicator for Layout */}
                  {show.seat_layout ? (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold mb-1">
                      <CheckCircle size={10}/> LAYOUT DESIGNED
                    </div>
                  ) : (
                    <div className="text-[10px] text-amber-400 font-bold mb-1 italic">
                      NO LAYOUT SET
                    </div>
                  )}
                  
                  <button 
                    onClick={() => navigate(`/event-layout/${eventId}`)}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                  >
                    <Armchair size={14}/> {show.seat_layout ? 'Edit Layout' : 'Design Layout'}
                  </button>
                  
                  <button 
                    onClick={() => navigate(`/events/${eventId}/edit-show/${show.id}`)}
                    className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-slate-400 px-4 py-2 rounded-lg text-xs font-bold border border-slate-800 transition-all"
                  >
                    <Edit3 size={14}/> Edit Time
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