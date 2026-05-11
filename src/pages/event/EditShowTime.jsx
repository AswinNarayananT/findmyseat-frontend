import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateShowTime, fetchFullEventDetails } from "../../store/event/eventThunk";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Clock, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function EditShowTime() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { eventId, showId } = useParams();

  const { event, loading: eventLoading } = useSelector(state => state.event);

  const [startTime, setStartTime] = useState("");
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (eventId) dispatch(fetchFullEventDetails(eventId));
  }, [dispatch, eventId]);

  useEffect(() => {
    if (event && event.shows && event.shows.length > 0) {
      const show = event.shows.find(s => s.id === showId);
      if (show) {
        // Format for datetime-local input: YYYY-MM-DDTHH:mm
        const date = new Date(show.start_time);
        const formattedDate = date.toISOString().slice(0, 16);
        setStartTime(formattedDate);
      }
    }
  }, [event, showId]);

  const submit = async () => {
    setFormError(null);
    if (!startTime) return setFormError("Please provide a new start time.");

    const now = new Date();
    if (new Date(startTime) < now) {
      return setFormError("Show time cannot be in the past.");
    }

    setIsSubmitting(true);
    const payload = {
      start_time: new Date(startTime).toISOString()
    };

    try {
      await dispatch(updateShowTime({ showId, payload })).unwrap();
      toast.success("Show time updated!");
      navigate(`/event/${eventId}`);
    } catch (err) {
      toast.error(err || "Failed to update show time");
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
      <main className="flex-1 p-6 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-lg bg-slate-900/40 border border-slate-800 rounded-[48px] p-8 md:p-10 shadow-2xl backdrop-blur-sm space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <Clock className="text-indigo-600" size={32} /> Edit Show Time
            </h1>
            <p className="text-slate-500 font-medium text-xs uppercase tracking-[0.2em]">
              Update the start time for this show
            </p>
          </header>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">New Start Time</label>
              <input 
                type="datetime-local" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
                className="w-full mt-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 outline-none font-bold text-sm text-white [color-scheme:dark]" 
              />
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
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Save Changes"}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
