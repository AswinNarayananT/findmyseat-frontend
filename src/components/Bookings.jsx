import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, 
  FaTimes, FaQrcode, FaMapPin, FaClock 
} from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import { fetchUserBookings } from "../store/event/eventThunk";

const Bookings = () => {
  const dispatch = useDispatch();
  const { bookings = [], loading } = useSelector((state) => state.event);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  if (loading && bookings.length === 0) {
    return <div className="p-10 text-blue-500 font-bold animate-pulse text-center">Loading your tickets...</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <div
            key={booking.id}
            onClick={() => setSelectedBooking(booking)}
            className="flex flex-col md:flex-row bg-[#1c2127] border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all cursor-pointer group shadow-xl"
          >
            {/* Left: Event Thumbnail */}
            <div className="md:w-40 h-40 md:h-auto bg-slate-800 shrink-0 relative">
              <img 
                src={booking.event_image || "https://via.placeholder.com/300x400"} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt="event"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
            </div>

            {/* Right: Booking Details */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                    {booking.category}
                  </p>
                  <h4 className="text-white text-xl font-black leading-tight">{booking.event_name}</h4>
                </div>
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Confirmed
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-3 mt-6">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <FaCalendarAlt className="text-blue-500" />
                  <span className="font-bold">{booking.event_date}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <FaClock className="text-blue-500" />
                  <span className="font-bold">{booking.show_time}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs col-span-2">
                  <FaMapMarkerAlt className="text-blue-500" />
                  <span className="font-bold truncate">{booking.venue_name}</span>
                </div>
              </div>
            </div>

            {/* Ticket Decoration (Stub Look) */}
            <div className="hidden md:flex flex-col items-center justify-center p-6 bg-blue-600/5 border-l border-dashed border-slate-700 w-24">
               <FaQrcode size={28} className="text-blue-500 mb-2 opacity-50" />
               <p className="[writing-mode:vertical-lr] text-[10px] font-black text-slate-500 tracking-widest">VIEW PASS</p>
            </div>
          </div>
        ))
      ) : (
        <div className="p-16 border-2 border-dashed border-slate-800 rounded-[40px] text-center bg-slate-900/20">
          <FaTicketAlt size={40} className="mx-auto text-slate-700 mb-4" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active bookings found</p>
        </div>
      )}

      {/* QR PASS MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[40px] w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Ticket Header */}
            <div className="bg-blue-600 p-8 text-white relative">
              <button 
                onClick={() => setSelectedBooking(null)} 
                className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <FaTimes size={20} />
              </button>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-80 mb-2">Admission Pass</h3>
              <h2 className="text-2xl font-black leading-tight uppercase tracking-tighter">{selectedBooking.event_name}</h2>
            </div>

            {/* QR Section */}
            <div className="p-8 flex flex-col items-center bg-white">
              <div className="bg-white p-4 rounded-3xl border-[12px] border-slate-50 shadow-inner mb-8">
                <QRCodeCanvas value={selectedBooking.id} size={200} level="H" />
              </div>

              {/* Ticket Info Grid */}
              <div className="w-full grid grid-cols-2 gap-6 border-y border-dashed border-slate-200 py-6 mb-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section</p>
                  <p className="text-slate-900 font-bold text-lg">{selectedBooking.section_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seat Number</p>
                  <p className="text-slate-900 font-bold text-lg">{selectedBooking.seat_label}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</p>
                  <p className="text-slate-900 font-bold">{selectedBooking.show_time}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gate</p>
                  <p className="text-slate-900 font-bold">Main Entry</p>
                </div>
              </div>

              {/* Venue Details */}
              <div className="w-full flex items-start gap-3 bg-slate-50 p-4 rounded-2xl">
                <FaMapPin className="text-blue-600 mt-1 shrink-0" />
                <div>
                  <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{selectedBooking.venue_name}</p>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{selectedBooking.venue_address}</p>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="bg-slate-900 p-4 text-center">
               <p className="text-[9px] font-bold text-slate-500 tracking-[0.5em] uppercase">Non-Transferable Pass</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;