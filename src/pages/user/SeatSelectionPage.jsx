import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchShowLayout, confirmAndLockSeats } from "../../store/event/eventThunk";
import { MapPin, ChevronLeft, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const SeatSelectionPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { layout, seats, loading } = useSelector((state) => state.event);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const MAX_SEATS = 10;
  const CELL_SIZE = 40;
  const GAP_SIZE = 10;

  useEffect(() => {
    if (showId) {
      dispatch(fetchShowLayout(showId));
      setSelectedSeats([]);
    }
  }, [showId, dispatch]);

  const getSeatStatus = (seat) => {
    if (!seat.seat_bookings || seat.seat_bookings.length === 0) return null;

    const activeBooking = seat.seat_bookings.find((sb) => {
      const parent = sb.booking;
      if (!parent) return false;

      const isBooked = parent.status === "booked";
      const isLocked = parent.status === "locked" && new Date(parent.locked_until) > new Date();
      
      return isBooked || isLocked;
    });

    return activeBooking?.booking?.status || null;
  };

  const handleSeatClick = (seat) => {
    const status = getSeatStatus(seat);
    const isUnavailable = status === "booked" || status === "locked";

    if (!seat.is_active || seat.seat_type !== "seat" || isUnavailable) return;

    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.id === seat.id);
      if (exists) return prev.filter((s) => s.id !== seat.id);
      if (prev.length >= MAX_SEATS) {
        toast.error(`Limit reached: ${MAX_SEATS} seats max.`);
        return prev;
      }
      return [...prev, seat];
    });
  };

  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) return;
    setIsProcessing(true);

    try {
      await dispatch(
        confirmAndLockSeats({
          show_id: showId,
          seat_ids: selectedSeats.map((s) => s.id),
        })
      ).unwrap();

      toast.success("Seats reserved! Proceed to payment.");
      navigate(`/booking/checkout/${showId}`);
    } catch (error) {
      toast.error(error || "Failed to reserve seats.");
      setIsProcessing(false);
    }
  };

  const sectionedGraph = useMemo(() => {
    if (!layout || !seats) return [];
    return layout.sections
      .map((section) => {
        const sectionSeats = seats.filter((s) => s.section_id === section.id);
        if (sectionSeats.length === 0) return null;
        return {
          ...section,
          minX: Math.min(...sectionSeats.map((s) => s.x_position)),
          maxX: Math.max(...sectionSeats.map((s) => s.x_position)),
          minY: Math.min(...sectionSeats.map((s) => s.y_position)),
          maxY: Math.max(...sectionSeats.map((s) => s.y_position)),
          seats: sectionSeats,
        };
      })
      .filter(Boolean);
  }, [layout, seats]);

  const rowLabelsMap = useMemo(() => {
    const mapping = {};
    seats?.forEach((s) => {
      if (s.seat_type === "seat" && s.row_label) mapping[s.y_position] = s.row_label;
    });
    return mapping;
  }, [seats]);

  const totalPrice = selectedSeats.reduce(
    (sum, s) => sum + (Number(s.section?.price) || 0),
    0
  );

  if (loading || !layout)
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-indigo-400 font-black uppercase tracking-widest">
          Constructing Venue Map...
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col selection:bg-indigo-500/30">
      <Navbar />
      
      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8">
          <aside className="col-span-12 lg:col-span-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 font-bold transition-all hover:-translate-x-1"
            >
              <ChevronLeft size={20} /> Back to Event
            </button>

            <div className="bg-slate-900/40 p-6 rounded-[32px] border border-slate-800 backdrop-blur-md sticky top-32">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
                Venue Legend
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                  <div className="w-4 h-4 rounded-md border-2 border-slate-700 bg-slate-800/50"></div>
                  Available
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                  <div className="w-4 h-4 rounded-md bg-indigo-500"></div> 
                  Selected
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                  <div className="w-4 h-4 rounded-md bg-slate-800 border-2 border-slate-700 opacity-20 relative flex items-center justify-center text-[8px]">
                    ✕
                  </div>
                  Sold Out
                </div>
              </div>
            </div>
          </aside>

          <section className="col-span-12 lg:col-span-9 space-y-6">
            <div className="bg-slate-950 rounded-[56px] p-16 border border-slate-800 overflow-auto flex flex-col items-center shadow-2xl relative">
              <div className="w-1/2 h-2 bg-slate-800/50 rounded-full mb-28 relative flex justify-center shadow-[0_0_60px_rgba(99,102,241,0.1)]">
                <span className="absolute -bottom-10 text-[10px] font-black text-slate-600 tracking-[1.5em] uppercase">
                  Stage / Screen
                </span>
              </div>

              <div
                className="grid relative mb-10"
                style={{
                  gridTemplateColumns: `60px repeat(${layout.columns}, ${CELL_SIZE}px)`,
                  gridTemplateRows: `repeat(${layout.rows}, ${CELL_SIZE}px)`,
                  gap: `${GAP_SIZE}px`,
                }}
              >
                {Object.entries(rowLabelsMap).map(([y, label]) => (
                  <div
                    key={y}
                    className="flex items-center justify-center text-xs font-black text-slate-700 uppercase"
                    style={{ gridRow: Number(y) + 1, gridColumn: 1 }}
                  >
                    {label}
                  </div>
                ))}

                {sectionedGraph.map((section) => (
                  <div
                    key={section.id}
                    className="relative border-2 rounded-[28px] bg-slate-900/10 transition-all duration-500"
                    style={{
                      gridColumnStart: section.minX + 2,
                      gridColumnEnd: section.maxX + 3,
                      gridRowStart: section.minY + 1,
                      gridRowEnd: section.maxY + 2,
                      borderColor: `${section.color}40`,
                    }}
                  >
                    <div
                      className="absolute -top-3.5 left-6 px-3 bg-[#020617] text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap z-10"
                      style={{ color: section.color }}
                    >
                      {section.name} • ₹{section.price}
                    </div>

                    {section.seats.map((seat) => {
                      const isSelected = selectedSeats.some((s) => s.id === seat.id);
                      const status = getSeatStatus(seat);
                      const isSold = status === "booked";
                      const isLocked = status === "locked";
                      const isUnavailable = isSold || isLocked;

                      if (seat.seat_type !== "seat") return null;

                      return (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          disabled={!seat.is_active || isUnavailable}
                          className={`absolute flex items-center justify-center transition-all duration-300 border-2 rounded-xl text-[10px] font-black ${
                            isSelected ? "scale-110 shadow-xl z-20" : "hover:scale-110 z-10"
                          } ${isUnavailable ? "opacity-20 bg-slate-800 cursor-not-allowed" : "cursor-pointer"}`}
                          style={{
                            width: `${CELL_SIZE}px`,
                            height: `${CELL_SIZE}px`,
                            left: `${(seat.x_position - section.minX) * (CELL_SIZE + GAP_SIZE)}px`,
                            top: `${(seat.y_position - section.minY) * (CELL_SIZE + GAP_SIZE)}px`,
                            backgroundColor: isSelected ? section.color : isUnavailable ? "#1e293b" : "transparent",
                            borderColor: isUnavailable ? "#334155" : isSelected ? "#fff" : section.color,
                            color: isSelected ? "#000" : isUnavailable ? "#475569" : section.color,
                          }}
                        >
                          {isSold ? "✕" : isLocked ? "..." : `${seat.row_label}${seat.seat_number}`}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {selectedSeats.length > 0 && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl bg-slate-900/95 backdrop-blur-2xl border border-white/10 p-8 rounded-[40px] shadow-2xl flex items-center justify-between z-50 animate-in slide-in-from-bottom-10 duration-500">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Tickets Selected
                    </p>
                    <span className="text-[10px] bg-indigo-500 px-2 py-0.5 rounded-full font-bold text-white">
                      {selectedSeats.length}/{MAX_SEATS}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map((s) => (
                      <div
                        key={s.id}
                        className="bg-slate-950 border border-indigo-500/20 px-4 py-2 rounded-2xl flex items-center gap-3"
                      >
                        <span className="text-xs font-black text-white">
                          {s.row_label}{s.seat_number}
                        </span>
                        <button
                          onClick={() => handleSeatClick(s)}
                          className="text-slate-500 hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-right pl-12 border-l border-white/10 flex flex-col items-end">
                  <p className="text-3xl font-black text-white mb-2">₹{totalPrice}</p>
                  <button
                    disabled={isProcessing}
                    onClick={handleConfirmBooking}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing && <Loader2 className="animate-spin" size={20} />}
                    {isProcessing ? "Reserving..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SeatSelectionPage;