import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSeatLayout, fetchFullEventDetails } from "../../store/event/eventThunk";
import { Plus, Trash2, LayoutGrid, MousePointer2, Eraser, Square, Calendar, Users, CheckCircle2, Circle, AlertCircle, Info } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const SeatLayoutBuilder = () => {
    const { eventId } = useParams(); 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { event, loading } = useSelector((state) => state.event);

    const [rows, setRows] = useState(10);
    const [cols, setCols] = useState(12);
    const [grid, setGrid] = useState([]);
    const [isMouseDown, setIsMouseDown] = useState(false);

    const [sections, setSections] = useState([
        { name: "Premium", price: 500, display_order: 1, color: "#f59e0b" },
        { name: "General", price: 250, display_order: 2, color: "#3b82f6" }
    ]);

    const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
    const [mode, setMode] = useState("seat");

    useEffect(() => {
        if (eventId) dispatch(fetchFullEventDetails(eventId));
    }, [eventId, dispatch]);

    const generateGrid = useCallback(() => {
        const newGrid = Array.from({ length: rows }, (_, r) =>
            Array.from({ length: cols }, (_, c) => ({
                x: c,
                y: r,
                seat_type: "empty",
                section_index: null,
            }))
        );
        setGrid(newGrid);
    }, [rows, cols]);

    useEffect(() => {
        generateGrid();
    }, [generateGrid]);

    useEffect(() => {
        if (event?.shows?.[0]?.seat_layout) {
            const layout = event.shows.find(s => s.seat_layout)?.seat_layout;
            if (layout) {
                setRows(layout.rows);
                setCols(layout.columns);
                setSections(layout.sections.map(s => ({...s})));
                
                const initialGrid = Array.from({ length: layout.rows }, (_, r) =>
                    Array.from({ length: layout.columns }, (_, c) => {
                        const seat = layout.seats.find(s => s.x_position === c && s.y_position === r);
                        const sIdx = layout.sections.findIndex(sec => sec.id === seat?.section_id);
                        return {
                            x: c,
                            y: r,
                            seat_type: seat?.seat_type || "empty",
                            section_index: sIdx !== -1 ? sIdx : null
                        };
                    })
                );
                setGrid(initialGrid);
            }
        }
    }, [event]);

    const updateSection = (index, field, value) => {
        const updated = [...sections];
        updated[index][field] = value;
        setSections(updated);
    };

    const addSection = () => {
        const newSection = {
            name: `Category ${sections.length + 1}`,
            price: 0,
            display_order: sections.length + 1,
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
        };
        setSections([...sections, newSection]);
    };

    const deleteSection = (index) => {
        if (sections.length <= 1) return alert("You need at least one category.");
        setGrid(grid.map(row => row.map(cell =>
            cell.section_index === index ? { ...cell, seat_type: 'empty', section_index: null } : cell
        )));
        setSections(sections.filter((_, i) => i !== index));
        setSelectedSectionIndex(0);
    };

    const updateCell = (r, c) => {
        setGrid((prevGrid) => {
            const newGrid = prevGrid.map((row) => row.map((cell) => ({ ...cell })));
            const cell = newGrid[r][c];
            if (mode === "seat") {
                cell.seat_type = "seat";
                cell.section_index = selectedSectionIndex;
            } else if (mode === "aisle") {
                cell.seat_type = "aisle";
                cell.section_index = null;
            } else {
                cell.seat_type = "empty";
                cell.section_index = null;
            }
            return newGrid;
        });
    };

    const currentSeatCount = useMemo(() => grid.flat().filter(cell => cell.seat_type === "seat").length, [grid]);
    const minShowCapacity = useMemo(() => (event?.shows?.length ? Math.min(...event.shows.map(s => s.capacity)) : Infinity), [event]);
    const isOverCapacity = currentSeatCount > minShowCapacity;

    const handleSave = async () => {
        if (isOverCapacity) {
            return toast.error(`Layout exceeds capacity! Please remove ${currentSeatCount - minShowCapacity} seats.`);
        }
        if (currentSeatCount === 0) {
            return toast.error("Please add at least one seat to the layout.");
        }
        
        const seats = [];
        let currentRowChar = 65; 
        grid.forEach((row, r) => {
            const hasSeats = row.some(cell => cell.seat_type === "seat");
            const rowLabel = hasSeats ? String.fromCharCode(currentRowChar) : null;
            let seatCounter = 1;
            row.forEach((cell, c) => {
                const isActualSeat = cell.seat_type === "seat";
                seats.push({
                    row_label: isActualSeat ? rowLabel : null, 
                    seat_number: isActualSeat ? seatCounter++ : null,
                    x_position: c,
                    y_position: r,
                    seat_type: cell.seat_type,
                    section_index: cell.section_index,
                });
            });
            if (hasSeats) currentRowChar++;
        });

        const payload = { 
            rows: Number(rows), 
            columns: Number(cols), 
            event_show_ids: event.shows.map(s => s.id), 
            sections: sections.map(s => ({
                name: s.name,
                price: Number(s.price),
                display_order: Number(s.display_order),
                color: s.color
            })),
            seats: seats 
        };
        
        try {
            await dispatch(createSeatLayout(payload)).unwrap();
            toast.success("Layout published successfully!");
            navigate(`/event/${eventId}`);
        } catch (error) {
            toast.error(error || "Failed to publish layout.");
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col text-slate-200" onMouseUp={() => setIsMouseDown(false)}>
            <Navbar />
            <div className="flex-1 p-6">
                <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-6">
                    <aside className="col-span-3 space-y-4 h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
                        {isOverCapacity && (
                            <div className="bg-rose-500/10 border border-rose-500/50 p-4 rounded-2xl animate-pulse">
                                <div className="flex items-center gap-2 text-rose-400 mb-1">
                                    <AlertCircle size={18} />
                                    <span className="text-xs font-black uppercase">Capacity Exceeded</span>
                                </div>
                                <p className="text-[10px] text-rose-300/80 leading-relaxed font-bold">
                                    Your current layout has {currentSeatCount} seats, which exceeds the show capacity of {minShowCapacity}. Remove {currentSeatCount - minShowCapacity} seats before publishing.
                                </p>
                            </div>
                        )}

                        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
                            <h2 className="text-xs font-black uppercase text-indigo-400 tracking-widest mb-2">Sync Status</h2>
                            <p className="text-[10px] text-slate-400 italic">Grid dimension changes will reset the layout.</p>
                        </div>

                        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                            <h2 className="text-sm font-black uppercase text-slate-500 mb-4 flex items-center gap-2 tracking-widest">
                                <LayoutGrid size={16} /> Grid Size
                            </h2>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Rows</label>
                                    <input type="number" value={rows} onChange={(e) => setRows(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 font-bold" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Cols</label>
                                    <input type="number" value={cols} onChange={(e) => setCols(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 font-bold" />
                                </div>
                            </div>
                            <button onClick={generateGrid} className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-black uppercase tracking-widest transition-all">Clear Grid</button>
                        </div>

                        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-sm font-black uppercase text-slate-500 tracking-widest">Categories</h2>
                                <button onClick={addSection} className="p-1 bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors"><Plus size={14} /></button>
                            </div>
                            <div className="space-y-2">
                                {sections.map((sec, idx) => (
                                    <div key={idx}
                                        className={`p-2 rounded-lg border-2 transition-all cursor-pointer ${selectedSectionIndex === idx && mode === 'seat' ? 'border-indigo-500' : 'border-slate-800'}`}
                                        style={{ backgroundColor: `${sec.color}10` }}
                                        onClick={() => { setMode("seat"); setSelectedSectionIndex(idx); }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={sec.color} onChange={(e) => updateSection(idx, 'color', e.target.value)} className="w-5 h-5 rounded cursor-pointer bg-transparent border-none p-0" />
                                            <input type="text" value={sec.name} onChange={(e) => updateSection(idx, 'name', e.target.value)} className="bg-transparent text-xs font-black uppercase w-full outline-none" />
                                            <button onClick={() => deleteSection(idx)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-[8px] font-black text-slate-500">₹</span>
                                            <input type="number" value={sec.price} onChange={(e) => updateSection(idx, 'price', e.target.value)} className="bg-transparent text-[10px] font-black w-full outline-none" placeholder="Price" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <main className="col-span-9 flex flex-col gap-6">
                        <header className="flex justify-between items-center bg-slate-900 p-5 rounded-[2rem] border border-slate-800 shadow-xl">
                            <div className="flex gap-4 items-center">
                                <div className="flex gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
                                    <button onClick={() => setMode("seat")} className={`px-6 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${mode === 'seat' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                                        <MousePointer2 size={14} /> Seats
                                    </button>
                                    <button onClick={() => setMode("aisle")} className={`px-6 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${mode === 'aisle' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                                        <Square size={14} /> Aisle
                                    </button>
                                    <button onClick={() => setMode("empty")} className={`px-6 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${mode === 'empty' ? 'bg-red-900/40 text-red-400' : 'text-slate-500 hover:text-slate-300'}`}>
                                        <Eraser size={14} /> Eraser
                                    </button>
                                </div>
                                <div className={`flex items-center gap-4 px-6 py-2 rounded-2xl border transition-colors ${isOverCapacity ? 'border-rose-500 bg-rose-500/10' : 'border-slate-800 bg-slate-950'}`}>
                                    <p className={`text-sm font-black ${isOverCapacity ? 'text-rose-400' : 'text-white'}`}>
                                        {currentSeatCount} / {minShowCapacity === Infinity ? '--' : minShowCapacity}
                                    </p>
                                    {isOverCapacity && <AlertCircle size={18} className="text-rose-500 animate-bounce" />}
                                </div>
                            </div>
                            <button 
                                onClick={handleSave} 
                                className={`px-10 py-3 font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl transition-all active:scale-95 ${isOverCapacity ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                            >
                                Publish Layout
                            </button>
                        </header>

                        <div className="flex-1 bg-slate-950 rounded-[3rem] border border-slate-800 p-16 overflow-auto flex flex-col items-center shadow-inner relative">
                            <div className="w-1/2 h-2 bg-indigo-500/10 rounded-full mb-20 relative flex justify-center shadow-[0_0_50px_rgba(99,102,241,0.1)]">
                                <span className="absolute -bottom-10 text-[10px] text-indigo-500/50 font-black tracking-[1.5em] uppercase italic">Stage / Screen</span>
                            </div>
                            <div className="inline-block bg-slate-900/10 p-10 rounded-[2.5rem] border border-slate-800/50">
                                {grid.map((row, r) => (
                                    <div key={r} className="flex items-center gap-2 mb-2">
                                        <div className="w-10 text-[10px] font-black text-slate-700 text-center uppercase italic">{String.fromCharCode(65 + r)}</div>
                                        {row.map((cell, c) => (
                                            <div
                                                key={c}
                                                onMouseDown={() => { setIsMouseDown(true); updateCell(r, c); }}
                                                onMouseEnter={() => { if (isMouseDown) updateCell(r, c); }}
                                                style={{
                                                    backgroundColor: cell.seat_type === 'seat' ? sections[cell.section_index]?.color :
                                                                     cell.seat_type === 'aisle' ? '#1e293b' : 'transparent',
                                                    border: cell.seat_type === 'empty' ? '1px solid #1e293b' : 'none'
                                                }}
                                                className={`w-9 h-9 rounded-xl transition-all duration-100 select-none relative group cursor-crosshair
                                                    ${cell.seat_type === 'seat' ? 'shadow-xl ring-2 ring-white/10' : ''}
                                                    ${cell.seat_type === 'empty' ? 'hover:bg-slate-800/50' : ''}`}
                                            >
                                                {cell.seat_type === 'seat' && (
                                                    <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-black/30 uppercase">
                                                        {c + 1}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SeatLayoutBuilder;