import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, 
  FaTimes, FaQrcode, FaMapPin, FaClock, FaChair
} from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import { fetchUserBookings } from "../store/event/eventThunk";

// Group seats by section_name
const groupSeatsBySection = (seats = []) => {
  return seats.reduce((acc, seat) => {
    if (!acc[seat.section_name]) acc[seat.section_name] = [];
    acc[seat.section_name].push(seat.seat_label);
    return acc;
  }, {});
};

const Bookings = () => {
  const dispatch = useDispatch();
  const { bookings = [], loading } = useSelector((state) => state.event);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  // Close on outside click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) setSelectedBooking(null);
  };

  if (loading && bookings.length === 0) {
    return <div className="p-10 text-blue-500 font-bold animate-pulse text-center">Loading your tickets...</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      {bookings.length > 0 ? (
        bookings.map((booking) => {
          const seatsBySection = groupSeatsBySection(booking.seats);
          return (
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

                <div className="grid grid-cols-2 gap-y-3 mt-4">
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

                {/* Seats grouped by section */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {Object.entries(seatsBySection).map(([section, seatLabels]) => (
                    <div key={section} className="flex items-center gap-2 bg-blue-500/5 border border-blue-500/15 rounded-lg px-3 py-1.5">
                      <FaChair size={9} className="text-blue-400 shrink-0" />
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider">{section}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{seatLabels.join(", ")}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ticket Stub */}
              <div className="hidden md:flex flex-col items-center justify-center p-6 bg-blue-600/5 border-l border-dashed border-slate-700 w-24">
                <FaQrcode size={28} className="text-blue-500 mb-2 opacity-50" />
                <p className="[writing-mode:vertical-lr] text-[10px] font-black text-slate-500 tracking-widest">VIEW PASS</p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="p-16 border-2 border-dashed border-slate-800 rounded-[40px] text-center bg-slate-900/20">
          <FaTicketAlt size={40} className="mx-auto text-slate-700 mb-4" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active bookings found</p>
        </div>
      )}

      {/* QR PASS MODAL */}
      {selectedBooking && (() => {
        const modalSeatsBySection = groupSeatsBySection(selectedBooking.seats);
        return (
          <div
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-6 overflow-y-auto"
          >
            <div className="bg-white rounded-[40px] w-full max-w-sm shadow-2xl overflow-hidden">

              {/* Header */}
              <div className="bg-blue-600 p-8 text-white relative">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FaTimes size={20} />
                </button>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-80 mb-2">Admission Pass</h3>
                <h2 className="text-2xl font-black leading-tight uppercase tracking-tighter">{selectedBooking.event_name}</h2>
                <p className="text-blue-200 text-xs mt-1 font-bold">
                  {selectedBooking.total_seats} Seat{selectedBooking.total_seats > 1 ? "s" : ""}
                </p>
              </div>

              {/* Body */}
              <div className="p-8 flex flex-col items-center bg-white">
                {/* QR Code */}
                <div className="bg-white p-4 rounded-3xl border-[12px] border-slate-50 shadow-inner mb-6">
                  <QRCodeCanvas value={selectedBooking.id} size={180} level="H" />
                </div>

                {/* Seats grouped by section */}
                <div className="w-full mb-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Seats</p>
                  <div className="flex flex-col gap-2">
                    {Object.entries(modalSeatsBySection).map(([section, seatLabels]) => (
                      <div key={section} className="flex items-start justify-between px-4 py-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-2">
                          <FaChair className="text-blue-500 shrink-0" size={12} />
                          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{section}</span>
                        </div>
                        <div className="flex flex-wrap justify-end gap-1 max-w-[55%]">
                          {seatLabels.map((label) => (
                            <span
                              key={label}
                              className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date / Time / Gate / Total */}
                <div className="w-full grid grid-cols-2 gap-4 border-y border-dashed border-slate-200 py-5 mb-5">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                    <p className="text-slate-900 font-bold">{selectedBooking.event_date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</p>
                    <p className="text-slate-900 font-bold">{selectedBooking.show_time}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gate</p>
                    <p className="text-slate-900 font-bold">Main Entry</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Seats</p>
                    <p className="text-slate-900 font-bold">{selectedBooking.total_seats}</p>
                  </div>
                </div>

                {/* Venue */}
                <div className="w-full flex items-start gap-3 bg-slate-50 p-4 rounded-2xl">
                  <FaMapPin className="text-blue-600 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{selectedBooking.venue_name}</p>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{selectedBooking.venue_address}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-900 p-4 text-center">
                <p className="text-[9px] font-bold text-slate-500 tracking-[0.5em] uppercase">Non-Transferable Pass</p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default Bookings;