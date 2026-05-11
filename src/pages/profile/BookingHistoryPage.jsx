import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Ticket, Calendar, MapPin, Clock, QrCode, Loader2, Inbox, Star, AlertCircle, CheckCircle2, X, Send } from "lucide-react";
import { fetchUserBookings, submitEventReview } from "../../store/event/eventThunk";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import toast from "react-hot-toast";

const BookingHistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookings, loading } = useSelector((state) => state.event);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  const upcomingBookings = bookings.filter(b => !b.is_completed);
  const completedBookings = bookings.filter(b => b.is_completed);

  const ReviewModal = ({ booking, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
      if (rating === 0) return toast.error("Please select a rating");
      setSubmitting(true);
      try {
        await dispatch(submitEventReview({ 
          eventId: booking.event_id, 
          rating, 
          comment 
        })).unwrap();
        toast.success("Review submitted! Thank you.");
        onClose();
      } catch (err) {
        toast.error(err || "Failed to submit review");
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Rate Event</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">{booking.event_name}</p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
                className="transition-transform active:scale-90"
              >
                <Star
                  size={36}
                  fill={(hover || rating) >= star ? "#6366f1" : "transparent"}
                  className={(hover || rating) >= star ? "text-indigo-500" : "text-slate-700"}
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none h-32 resize-none mb-6 focus:border-indigo-500 transition-colors"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all disabled:opacity-50"
          >
            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </div>
    );
  };

  const TicketModal = ({ booking, onClose }) => (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="bg-indigo-600 p-8 text-white text-center relative">
          <p className="font-black uppercase tracking-[0.3em] text-[10px] opacity-80 mb-1">Official Entry Pass</p>
          <h3 className="font-black italic text-xl uppercase tracking-tighter">FindMySeat</h3>
        </div>
        <div className="p-8 flex flex-col items-center">
          <div className="bg-white p-4 rounded-[2rem] border-8 border-slate-50 mb-6 shadow-inner">
            <QRCodeCanvas value={booking.id} size={180} level={"H"} includeMargin={false} />
          </div>
          <div className="text-center space-y-1 mb-6">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-tight">{booking.event_name}</h2>
            <p className="text-indigo-600 font-black text-xs uppercase tracking-widest italic">{booking.venue_name}</p>
          </div>
          <div className="w-full border-t-4 border-dotted border-slate-200 my-6 relative">
            <div className="absolute -left-12 -top-4 w-8 h-8 bg-black/90 rounded-full"></div>
            <div className="absolute -right-12 -top-4 w-8 h-8 bg-black/90 rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 gap-8 w-full text-center">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Show Time</p>
              <p className="font-black text-slate-800 text-sm">{booking.show_time}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Seats</p>
              <p className="font-black text-slate-800 text-sm">{booking.total_seats}</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="w-full py-6 bg-slate-900 font-black text-white text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all">Close Pass</button>
      </div>
    </div>
  );

  const BookingCard = ({ booking }) => (
    <div className="bg-slate-900/30 border border-slate-800/50 rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-10 hover:border-indigo-500/30 transition-all group backdrop-blur-sm">
      <div className="w-full md:w-56 h-40 bg-slate-800 rounded-[2rem] overflow-hidden shrink-0 shadow-2xl relative">
        <img src={booking.event_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-indigo-600/10 mix-blend-overlay"></div>
      </div>
      <div className="flex-1 space-y-4 w-full">
        <div className="flex items-center gap-3">
          <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${
            booking.is_completed ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
          }`}>
            {booking.is_completed ? 'Event Completed' : 'Confirmed'}
          </span>
          {booking.is_checked_in && (
            <span className="text-[9px] font-black bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full uppercase tracking-widest border border-indigo-500/20 flex items-center gap-1">
              <CheckCircle2 size={10} /> Checked-In
            </span>
          )}
        </div>
        <div>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic group-hover:text-indigo-400 transition-colors">{booking.event_name}</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-xs text-slate-500 font-black uppercase tracking-wider">
            <span className="flex items-center gap-2"><Calendar size={14} className="text-indigo-500" /> {booking.event_date}</span>
            <span className="flex items-center gap-2"><Clock size={14} className="text-indigo-500" /> {booking.show_time}</span>
            <span className="flex items-center gap-2"><MapPin size={14} className="text-indigo-500" /> {booking.venue_name}</span>
          </div>
        </div>
      </div>
      <div className="shrink-0 w-full md:w-auto flex flex-col gap-3">
        {!booking.is_completed ? (
          <button 
            onClick={() => setSelectedTicket(booking)}
            className="bg-white text-slate-900 hover:bg-indigo-600 hover:text-white px-10 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-white/5"
          >
            <QrCode size={18}/> View Pass
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            {booking.is_checked_in ? (
              <button 
                onClick={() => setReviewBooking(booking)}
                className="bg-indigo-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:bg-indigo-500 shadow-xl shadow-indigo-900/40"
              >
                <Star size={18} fill="white"/> Rate Event
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-slate-800/50 px-6 py-4 rounded-2xl border border-slate-700/50">
                <AlertCircle size={14} className="text-slate-500" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Attendance required for review</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col text-slate-200">
      <Navbar />
      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <header className="mb-16">
            <div className="flex items-center gap-3 text-indigo-500 font-black uppercase text-[10px] tracking-[0.3em] mb-3">
              <Ticket size={14} /> <span>Personal Dashboard</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter italic">My <span className="text-indigo-600">Bookings</span></h1>
          </header>
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-500">
              <Loader2 className="animate-spin text-indigo-500" size={40} />
              <p className="text-[10px] font-black uppercase tracking-widest">Retrieving Tickets...</p>
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-20">
              {upcomingBookings.length > 0 && (
                <section>
                  <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-8 border-l-4 border-indigo-500 pl-4">Upcoming Experiences</h2>
                  <div className="grid gap-6">{upcomingBookings.map(b => <BookingCard key={b.id} booking={b} />)}</div>
                </section>
              )}
              {completedBookings.length > 0 && (
                <section>
                  <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-8 border-l-4 border-slate-700 pl-4">Past Memories</h2>
                  <div className="grid gap-6">{completedBookings.map(b => <BookingCard key={b.id} booking={b} />)}</div>
                </section>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-slate-900/20 rounded-[4rem] border-2 border-dashed border-slate-800/50 text-center text-slate-500">
              <Inbox size={40} className="mb-6 opacity-20" />
              <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No bookings found</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      {selectedTicket && <TicketModal booking={selectedTicket} onClose={() => setSelectedTicket(null)} />}
      {reviewBooking && <ReviewModal booking={reviewBooking} onClose={() => setReviewBooking(null)} />}
    </div>
  );
};

export default BookingHistoryPage;