import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMyEvents } from "../../store/event/eventThunk";
import { PlusCircle, Eye, LayoutGrid, Calendar, Clock, Loader2, Plus } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function MyEvents() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { events, loading } = useSelector((state) => state.event);

  useEffect(() => {
    dispatch(getMyEvents());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-indigo-500" size={48} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col text-slate-200">
      <Navbar />

      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-[1440px] mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                Organizer <span className="text-indigo-600">Dashboard</span>
              </h1>
              <p className="text-slate-500 font-medium mt-2 uppercase text-[10px] tracking-[0.3em]">
                Manage your created events and schedules
              </p>
            </div>

            <button
              onClick={() => navigate("/create-event")}
              className="flex items-center gap-2 bg-indigo-600 px-8 py-4 rounded-2xl hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Plus size={18} />
              Create Event
            </button>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-32 bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-[48px]">
              <div className="bg-slate-800 size-16 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
                 <Calendar size={32} />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">No Events Found</h3>
              <p className="text-slate-500 text-sm mt-2">You haven't created any events yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-slate-900/40 rounded-[40px] overflow-hidden border border-slate-800 hover:border-indigo-600/40 transition-all group flex flex-col shadow-2xl backdrop-blur-sm"
                >
                  {/* Image Header */}
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={event.image_url || "https://placehold.co/600x800"}
                      alt={event.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-indigo-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest">
                      {event.category}
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1 space-y-4">
                    <div className="flex-1 space-y-2">
                      <h2 className="text-xl font-black text-white uppercase tracking-tight leading-none group-hover:text-indigo-400 transition-colors">
                        {event.title}
                      </h2>
                      <p className="text-slate-500 text-xs font-medium line-clamp-2">
                        {event.description || "No description provided."}
                      </p>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-y border-slate-800/50 py-3">
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} className="text-indigo-500" />
                        {event.estimated_duration_minutes}m
                      </span>
                      <span className="flex items-center gap-1.5">
                        <LayoutGrid size={12} className="text-indigo-500" />
                        {event.entry_type === "SEAT_WISE" ? "Seat Based" : "General"}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => navigate(`/event/${event.id}`)}
                        className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        <Eye size={14} />
                        View
                      </button>

                      <button
                        onClick={() => navigate(`/create-event-show/${event.id}`)}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/10"
                      >
                        <PlusCircle size={14} />
                        Add Show
                      </button>
                    </div>

                    {/* Secondary Action */}
                    <button
                      onClick={() => navigate(`/event-layout/${event.id}`)}
                      className="w-full flex items-center justify-center gap-2 border border-slate-800 hover:border-indigo-600/50 hover:bg-indigo-600/5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
                    >
                      <LayoutGrid size={14} />
                      Manage Layout
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}