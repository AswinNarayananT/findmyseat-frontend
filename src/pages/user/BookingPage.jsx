import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicEventDetails } from "../../store/event/eventThunk";
import { Calendar, MapPin, Clock, Ticket, ChevronRight, Info, Star, Edit, Trash2, Loader2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import api from "../../api/axios";
import toast from "react-hot-toast";

const BookingPage = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { event, loading } = useSelector((state) => state.event);
  const { user } = useSelector((state) => state.auth);
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchPublicEventDetails(eventId));
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

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/events/${eventId}/reviews/${reviewId}`);
      toast.success("Review deleted!");
      dispatch(fetchPublicEventDetails(eventId));
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete review");
    }
  };

  const handleUpdateReview = async () => {
    if (editRating === 0) return toast.error("Please provide a star rating.");
    setIsSubmitting(true);
    try {
      await api.put(`/events/${eventId}/reviews/${editingReview.id}`, {
        rating: editRating,
        comment: editComment
      });
      toast.success("Review updated!");
      setEditingReview(null);
      dispatch(fetchPublicEventDetails(eventId));
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) return <div className="p-20 text-white text-center">Event not found.</div>;

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col text-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Banner Section */}
        <div className="relative h-[400px] w-full overflow-hidden">
          <img 
            src={event.image_url} 
            className="w-full h-full object-cover blur-sm opacity-30 scale-110" 
            alt="" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent"></div>
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col md:flex-row gap-10">
              <img 
                src={event.image_url} 
                className="w-64 h-96 object-cover rounded-[2rem] shadow-2xl border-4 border-slate-900 z-10" 
                alt={event.title} 
              />
              <div className="flex flex-col justify-end pb-4 space-y-4">
                <div className="flex items-center gap-2 bg-indigo-600/20 text-indigo-400 px-4 py-1.5 rounded-full w-fit text-[10px] font-black uppercase tracking-widest border border-indigo-600/30">
                  <Star size={12} fill="currentColor" /> Featured {event.category}
                </div>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
                  {event.title}
                </h1>
                <div className="flex items-center gap-6 text-slate-400 font-bold text-sm">
                   <span className="flex items-center gap-2"><Clock size={16} /> {event.estimated_duration_minutes} Mins</span>
                   <span className="flex items-center gap-2"><Info size={16} /> {event.entry_type?.replace('_', ' ')} Entry</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-16">
          
          {/* Details */}
          <div className="max-w-4xl space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-widest text-indigo-500">About the Event</h3>
            <p className="text-slate-400 leading-relaxed text-lg italic">
              {event.description}
            </p>
          </div>

          <hr className="border-slate-800/50" />

          {/* Show Selection (BookMyShow Style Layout) */}
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h3 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
                <Ticket className="text-indigo-500" /> Book Your Spot
              </h3>
              
              {/* Date Selector */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {sortedDates.map((date) => {
                  const d = new Date(date);
                  const isSelected = selectedDate === date;
                  return (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedShow(null);
                      }}
                      className={`flex flex-col items-center min-w-[80px] py-3 rounded-2xl border transition-all ${
                        isSelected 
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/40" 
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">
                        {d.toLocaleString("en-US", { weekday: "short" })}
                      </span>
                      <span className="text-xl font-black">{d.getDate()}</span>
                      <span className="text-[10px] font-black uppercase opacity-70">
                        {d.toLocaleString("en-US", { month: "short" })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots for Selected Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedDate && groupedShows[selectedDate]?.map((show) => (
                <div 
                  key={show.id}
                  onClick={() => setSelectedShow(show)}
                  className={`group relative p-8 rounded-[2rem] border transition-all cursor-pointer overflow-hidden ${
                    selectedShow?.id === show.id 
                      ? "bg-indigo-600/10 border-indigo-500" 
                      : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-2xl font-black">
                        {new Date(show.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Show Time</p>
                    </div>
                    <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedShow?.id === show.id ? "border-indigo-500 bg-indigo-500" : "border-slate-700"
                    }`}>
                      {selectedShow?.id === show.id && <ChevronRight size={14} strokeWidth={4} />}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <MapPin size={14} className="text-indigo-500" /> {show.venue.name}
                    </p>
                    <p className="text-[10px] text-slate-500 ml-5 truncate">{show.venue.formatted_address}</p>
                  </div>

                  {/* Decorative background number */}
                  <span className="absolute -right-4 -bottom-6 text-8xl font-black text-white/5 italic group-hover:text-white/10 transition-colors">
                    {new Date(show.start_time).getHours()}
                  </span>
                </div>
              ))}
            </div>

            {/* Sticky/Fixed Footer Action (Mobile/Desktop Sync) */}
            {selectedShow && (
              <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-50 animate-in slide-in-from-bottom-10 duration-500">
                <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl flex items-center justify-between gap-4">
                  <div className="pl-6 text-slate-900">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Selected Show</p>
                    <p className="font-black">
                      {new Date(selectedShow.start_time).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })} • 
                      {new Date(selectedShow.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate(`/booking/seats/${selectedShow.id}`)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-3"
                  >
                    Select Seats <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <hr className="border-slate-800/50" />

          {/* Reviews Section */}
          <div className="space-y-6 max-w-4xl">
            <h3 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
              <Star className="text-indigo-500 fill-indigo-500" /> Reviews
            </h3>
            
            {event.reviews && event.reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.reviews.map(review => (
                  <div key={review.id} className="bg-slate-900/40 p-6 rounded-[2rem] border border-slate-800 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-indigo-600 flex items-center justify-center font-black text-white uppercase shadow-lg shadow-indigo-600/20">
                          {review.user_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{review.user_name}</p>
                          <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star key={star} size={12} className={star <= review.rating ? "fill-yellow-500 text-yellow-500" : "text-slate-700"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      {user && user.id === review.user_id && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setEditingReview(review);
                              setEditRating(review.rating);
                              setEditComment(review.comment || "");
                            }}
                            className="text-slate-500 hover:text-indigo-400 transition-colors p-1"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                    {review.comment && (
                      <p className="text-sm text-slate-400 italic">"{review.comment}"</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900/40 p-10 rounded-[2rem] border border-slate-800 text-center">
                <p className="text-slate-500 font-bold">No reviews yet for this event.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 max-w-md w-full shadow-2xl relative">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-6">Edit Review</h2>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-transform hover:scale-110 active:scale-95"
                  onClick={() => setEditRating(star)}
                >
                  <Star size={36} className={`transition-colors duration-200 ${editRating >= star ? "fill-yellow-500 text-yellow-500" : "text-slate-700"}`} />
                </button>
              ))}
            </div>

            <textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              placeholder="Update your comment..."
              className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 outline-none font-medium text-sm text-white placeholder:text-slate-600 resize-none h-28 focus:border-indigo-500/50 transition-colors mb-6"
            />

            <div className="flex gap-4">
              <button 
                onClick={() => setEditingReview(null)}
                className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-[24px] font-black text-xs uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateReview}
                disabled={isSubmitting}
                className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all flex justify-center items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BookingPage;