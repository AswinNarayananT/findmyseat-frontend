import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchShowLayout } from "../../store/event/eventThunk";
import { MapPin, ChevronLeft, Ticket, X } from "lucide-react";

const SeatSelectionPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { eventShows, layout, seats, loading } = useSelector((state) => state.event);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Constants for perfectly matching the XY grid dimensions
  const CELL_SIZE = 40; // Base size for the seat buttons
  const GAP_SIZE = 10;   // Gap between grid cells
  const PADDING = 16;   // Padding inside the category box

  useEffect(() => {
    if (showId) {
      dispatch(fetchShowLayout(showId));
      setSelectedSeats([]);
    }
  }, [showId, dispatch]);

  const sectionedGraph = useMemo(() => {
    if (!layout || !seats) return [];
    const sortedSections = [...layout.sections].sort((a, b) => a.display_order - b.display_order);

    return sortedSections.map(section => {
      const sectionSeats = seats.filter(s => s.section_id === section.id);
      if (sectionSeats.length === 0) return null;

      const minX = Math.min(...sectionSeats.map(s => s.x_position));
      const maxX = Math.max(...sectionSeats.map(s => s.x_position));
      const minY = Math.min(...sectionSeats.map(s => s.y_position));
      const maxY = Math.max(...sectionSeats.map(s => s.y_position));

      return { ...section, minX, maxX, minY, maxY, seats: sectionSeats };
    }).filter(Boolean);
  }, [layout, seats]);

  const rowLabelsMap = useMemo(() => {
    const mapping = {};
    seats?.forEach(s => {
      if (s.seat_type === 'seat' && s.row_label) mapping[s.y_position] = s.row_label;
    });
    return mapping;
  }, [seats]);

  const handleSeatClick = (seat) => {
    if (!seat.is_active || seat.seat_type !== "seat") return;
    setSelectedSeats(prev => {
      const exists = prev.find(s => s.id === seat.id);
      return exists ? prev.filter(s => s.id !== seat.id) : [...prev, seat];
    });
  };

  const currentShow = eventShows.find(s => s.id === showId);
  const totalPrice = selectedSeats.reduce((sum, s) => sum + (Number(s.section?.price) || 0), 0);

  if (loading || !layout) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-indigo-400 font-black uppercase tracking-widest">Constructing Venue Map...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 selection:bg-indigo-500/30">
      <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8">
        
        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 font-bold transition-all hover:-translate-x-1">
            <ChevronLeft size={20}/> Back to Event
          </button>
          <div className="bg-slate-900/40 p-6 rounded-[32px] border border-slate-800 backdrop-blur-md">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Timings</h2>
            <div className="space-y-3">
              {eventShows.map((show) => (
                <div 
                  key={show.id}
                  onClick={() => navigate(`/booking/seats/${show.id}`)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${show.id === showId ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}
                >
                  <p className="font-bold text-sm">{new Date(show.start_time).toLocaleDateString([], { day: 'numeric', month: 'short' })}</p>
                  <p className="text-[10px] text-slate-500 font-bold">{new Date(show.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Seating Area */}
        <main className="col-span-12 lg:col-span-9 space-y-6">
          <div className="bg-slate-950 rounded-[56px] p-16 border border-slate-800 overflow-auto flex flex-col items-center shadow-2xl">
            
            {/* Stage UI */}
            <div className="w-1/2 h-2 bg-slate-800/50 rounded-full mb-28 relative flex justify-center shadow-[0_0_60px_rgba(99,102,241,0.1)]">
              <span className="absolute -bottom-10 text-[10px] font-black text-slate-600 tracking-[1.5em] uppercase">Stage / Screen</span>
            </div>

            {/* The XY Master Grid */}
            <div 
              className="grid relative" 
              style={{ 
                // Col 1: Label, then dynamic columns based on layout
                gridTemplateColumns: `60px repeat(${layout.columns}, ${CELL_SIZE}px)`,
                gridTemplateRows: `repeat(${layout.rows}, ${CELL_SIZE}px)`,
                gap: `${GAP_SIZE}px`
              }}
            >
              {/* Global Row Labels */}
              {Object.entries(rowLabelsMap).map(([y, label]) => (
                <div 
                  key={y} 
                  className="flex items-center justify-center text-xs font-black text-slate-700 uppercase"
                  style={{ gridRow: Number(y) + 1, gridColumn: 1 }}
                >
                  {label}
                </div>
              ))}

              {/* Category Boxes */}
              {sectionedGraph.map((section) => (
                <div
                  key={section.id}
                  className="relative border-2 rounded-[28px] bg-slate-900/10 group transition-all duration-500"
                  style={{
                    // Align the box exactly to the seat coordinates
                    gridColumnStart: section.minX + 2,
                    gridColumnEnd: section.maxX + 3,
                    gridRowStart: section.minY + 1,
                    gridRowEnd: section.maxY + 2,
                    borderColor: `${section.color}40`,
                    boxShadow: `inset 0 0 40px ${section.color}08`,
                  }}
                >
                  {/* Category Label */}
                  <div 
                    className="absolute -top-3.5 left-6 px-3 bg-[#020617] text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap z-10"
                    style={{ color: section.color }}
                  >
                    {section.name} • ₹{section.price}
                  </div>

                  {/* Render Seats inside this specific box container */}
                  {section.seats.map((seat) => {
                    const isSelected = selectedSeats.some(s => s.id === seat.id);
                    if (seat.seat_type !== 'seat') return null;

                    return (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={!seat.is_active}
                        className={`absolute flex items-center justify-center transition-all duration-300 border-2 rounded-xl text-[10px] font-black
                          ${isSelected ? 'scale-110 shadow-xl z-20' : 'hover:scale-110 z-10'}
                          ${!seat.is_active ? 'opacity-20 grayscale' : 'cursor-pointer'}
                        `}
                        style={{
                          // Formula to place seat perfectly in XY slot relative to parent box
                          width: `${CELL_SIZE}px`,
                          height: `${CELL_SIZE}px`,
                          left: `${(seat.x_position - section.minX) * (CELL_SIZE + GAP_SIZE)}px`,
                          top: `${(seat.y_position - section.minY) * (CELL_SIZE + GAP_SIZE)}px`,
                          backgroundColor: isSelected ? section.color : 'transparent',
                          borderColor: sectionColorLogic(isSelected, section.color),
                          color: isSelected ? '#000' : section.color,
                          boxShadow: isSelected ? `0 0 20px ${section.color}60` : 'none'
                        }}
                      >
                        {seat.row_label}{seat.seat_number}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* CHECKOUT BAR */}
          {selectedSeats.length > 0 && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl bg-slate-900/95 backdrop-blur-2xl border border-white/10 p-8 rounded-[40px] shadow-2xl flex items-center justify-between z-50 animate-in slide-in-from-bottom-10">
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Tickets Selected</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map(s => (
                    <div key={s.id} className="bg-slate-950 border border-indigo-500/20 px-4 py-2 rounded-2xl flex items-center gap-3">
                      <span className="text-xs font-black text-white">{s.row_label}{s.seat_number}</span>
                      <button onClick={() => handleSeatClick(s)} className="text-slate-500 hover:text-red-500 transition-colors"><X size={14}/></button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-right pl-12 border-l border-white/10 flex flex-col items-end">
                <p className="text-3xl font-black text-white mb-2">₹{totalPrice}</p>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/30 active:scale-95">
                  Confirm Booking
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Helper for button borders
const sectionColorLogic = (isSelected, color) => isSelected ? '#fff' : color;

export default SeatSelectionPage;