import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { QRCodeCanvas } from "qrcode.react"; // npm install qrcode.react
import { Ticket, Calendar, MapPin, Clock, QrCode, Download } from "lucide-react";
import { fetchUserBookings } from "../../store/event/eventThunk";

const BookingHistoryPage = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.event);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  const TicketModal = ({ booking, onClose }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <h3 className="font-black uppercase tracking-widest text-sm">Entry Pass</h3>
        </div>
        
        <div className="p-8 flex flex-col items-center">
          {/* The QR Code contains the Booking ID for the Organizer to scan */}
          <div className="bg-white p-4 rounded-2xl border-4 border-slate-100 mb-6">
            <QRCodeCanvas 
              value={booking.id} 
              size={200}
              level={"H"}
              includeMargin={true}
            />
          </div>
          
          <h2 className="text-xl font-black mb-1 text-center">{booking.event_name}</h2>
          <p className="text-slate-500 font-bold text-sm mb-4">{booking.show_time}</p>
          
          <div className="w-full border-t-2 border-dashed border-slate-200 my-4 relative">
            <div className="absolute -left-10 -top-3 w-6 h-6 bg-black/80 rounded-full"></div>
            <div className="absolute -right-10 -top-3 w-6 h-6 bg-black/80 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full text-center">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Seat</p>
              <p className="font-bold">{booking.seat_label}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Type</p>
              <p className="font-bold">{booking.section_name}</p>
            </div>
          </div>
        </div>
        
        <button onClick={onClose} className="w-full py-4 bg-slate-100 font-black text-slate-500 hover:bg-slate-200 transition-colors">
          CLOSE
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-white mb-2">My Bookings</h1>
          <p className="text-slate-400">Manage your upcoming events and digital tickets.</p>
        </header>

        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-6 flex flex-col md:flex-row items-center gap-8 hover:border-indigo-500/50 transition-all group">
              <div className="w-full md:w-48 h-32 bg-slate-800 rounded-2xl overflow-hidden shrink-0">
                <img src={booking.event_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <div className="flex-1 space-y-2">
                <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-widest">
                  Confirmed
                </span>
                <h3 className="text-xl font-black text-white">{booking.event_name}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-slate-400 font-bold">
                  <span className="flex items-center gap-1"><Calendar size={14}/> {booking.event_date}</span>
                  <span className="flex items-center gap-1"><Clock size={14}/> {booking.show_time}</span>
                  <span className="flex items-center gap-1"><MapPin size={14}/> {booking.venue_name}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedTicket(booking)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all"
                >
                  <QrCode size={18}/> VIEW TICKET
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedTicket && <TicketModal booking={selectedTicket} onClose={() => setSelectedTicket(null)} />}
    </div>
  );
};

export default BookingHistoryPage;