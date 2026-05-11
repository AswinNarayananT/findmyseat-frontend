import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Star, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const ReviewPromptManager = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [currentReview, setCurrentReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === "user") {
      fetchPendingReviews();
    }
  }, [isAuthenticated, user]);

  const fetchPendingReviews = async () => {
    try {
      const res = await api.get("/events/pending-reviews");
      if (res.data && res.data.length > 0) {
        setPendingReviews(res.data);
        setCurrentReview(res.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch pending reviews:", error);
    }
  };

  const skipReview = () => {
    const nextReviews = pendingReviews.slice(1);
    setPendingReviews(nextReviews);
    if (nextReviews.length > 0) {
      setCurrentReview(nextReviews[0]);
      setRating(0);
      setComment("");
    } else {
      setCurrentReview(null);
    }
  };

  const submitReview = async () => {
    if (rating === 0) {
      toast.error("Please provide a star rating.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/events/${currentReview.event_id}/reviews`, {
        rating,
        comment
      });
      toast.success("Thank you for your feedback!");
      skipReview(); // Move to next or close
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentReview) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={skipReview}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 p-2 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 rounded-3xl overflow-hidden border-2 border-indigo-500/30 shadow-lg">
            <img 
              src={currentReview.image_url || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=300&auto=format&fit=crop"} 
              alt={currentReview.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">How was it?</h2>
            <p className="text-sm font-medium text-slate-400 mt-2">
              You recently attended <span className="text-indigo-400 font-bold">{currentReview.title}</span>. Rate your experience!
            </p>
          </div>

          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform hover:scale-110 active:scale-95"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={36}
                  className={`transition-colors duration-200 ${
                    (hoverRating || rating) >= star
                      ? "fill-yellow-500 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]"
                      : "text-slate-700"
                  }`}
                />
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us more about your experience... (optional)"
            className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 outline-none font-medium text-sm text-white placeholder:text-slate-600 resize-none h-28 focus:border-indigo-500/50 transition-colors"
          />

          <button
            onClick={submitReview}
            disabled={isSubmitting || rating === 0}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Submit Review"}
          </button>
          
          <button 
            onClick={skipReview}
            className="text-[10px] font-black text-slate-500 hover:text-slate-300 uppercase tracking-widest transition-colors mt-2"
          >
            Ask me later
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPromptManager;
