import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSeatLayout, fetchFullEventDetails } from "../../store/event/eventThunk";
import { Plus, Trash2, LayoutGrid, MousePointer2, Eraser, Square, Calendar, Users, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const SeatLayoutBuilder = () => {
    // Note: The route should be /event-layout/:eventId
    const { eventId } = useParams(); 
    const dispatch = useDispatch();
      console.log(eventId)
    
    // Redux State
    const { event, eventShows, loading } = useSelector((state) => state.event);

    // Grid & Interaction State
    const [rows, setRows] = useState(10);
    const [cols, setCols] = useState(12);
    const [grid, setGrid] = useState([]);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [selectedShowIds, setSelectedShowIds] = useState([]);

    // Categories (SeatSections)
    const [sections, setSections] = useState([
        { name: "Premium", price: 500, display_order: 1, color: "#f59e0b" },
        { name: "General", price: 250, display_order: 2, color: "#3b82f6" }
    ]);

    const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
    const [mode, setMode] = useState("seat");

    // 1. Fetch Event and Shows on Mount
    useEffect(() => {
        if (eventId) {
            console.log("calling the api")
            dispatch(fetchFullEventDetails(eventId));
        }
    }, [eventId, dispatch]);

    // 2. Initialize/Reset Grid
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

    // 3. Section Management Functions (FIXED: Added missing functions)
    const addSection = () => {
        const newSection = {
            name: `Category ${sections.length + 1}`,
            price: 0,
            display_order: sections.length + 1,
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
        };
        setSections([...sections, newSection]);
    };

    const updateSection = (index, field, value) => {
        const updated = [...sections];
        updated[index][field] = value;
        setSections(updated);
    };

    const deleteSection = (index) => {
        if (sections.length <= 1) return alert("You need at least one category.");
        // Reset any seats using this section back to empty
        setGrid(grid.map(row => row.map(cell =>
            cell.section_index === index ? { ...cell, seat_type: 'empty', section_index: null } : cell
        )));
        setSections(sections.filter((_, i) => i !== index));
        setSelectedSectionIndex(0);
    };

    // 4. Painting Logic
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

    // 5. Capacity & Show Selection Logic
    const currentSeatCount = useMemo(() => {
        return grid.flat().filter(cell => cell.seat_type === "seat").length;
    }, [grid]);

    const minSelectedCapacity = useMemo(() => {
        const selected = eventShows.filter(s => selectedShowIds.includes(s.id));
        if (selected.length === 0) return Infinity;
        return Math.min(...selected.map(s => s.capacity));
    }, [selectedShowIds, eventShows]);

    const isOverCapacity = currentSeatCount > minSelectedCapacity;

    const toggleShowSelection = (id) => {
        setSelectedShowIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const selectAllShows = () => {
        if (selectedShowIds.length === eventShows.length) {
            setSelectedShowIds([]);
        } else {
            setSelectedShowIds(eventShows.map(s => s.id));
        }
    };

const handleSave = () => {
    if (selectedShowIds.length === 0) return toast.error("Select at least one show.");
    
    const seats = [];
    let currentRowChar = 65; // ASCII for 'A'

    grid.forEach((row, r) => {
        // Check if there is at least one 'seat' in this horizontal row
        const hasSeats = row.some(cell => cell.seat_type === "seat");
        
        // Only assign a letter if the row isn't empty
        const rowLabel = hasSeats ? String.fromCharCode(currentRowChar) : null;
        
        let seatCounter = 1;
        row.forEach((cell, c) => {
            const isActualSeat = cell.seat_type === "seat";
            
            seats.push({
                // Row label is only 'A', 'B', etc. if the row has seats
                row_label: isActualSeat ? rowLabel : null, 
                seat_number: isActualSeat ? seatCounter++ : null,
                x_position: c,
                y_position: r,
                seat_type: cell.seat_type,
                section_index: cell.section_index,
            });
        });

        // Increment the letter for the NEXT row only if we used the current one
        if (hasSeats) currentRowChar++;
    });

    const payload = { 
        rows: Number(rows), 
        columns: Number(cols), 
        event_show_ids: selectedShowIds, 
        sections: sections.map(s => ({
            name: s.name,
            price: Number(s.price),
            display_order: Number(s.display_order),
            color: s.color
        })),
        seats: seats 
    };
    
    dispatch(createSeatLayout(payload));
};

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 p-6 font-sans" onMouseUp={() => setIsMouseDown(false)}>
            <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-6">

                {/* Sidebar */}
                <aside className="col-span-3 space-y-4 h-[90vh] overflow-y-auto pr-2">
                    
                    {/* Shows Selection Card */}
                    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-bold uppercase text-slate-500 tracking-widest">Apply to Shows</h2>
                            <button onClick={selectAllShows} className="text-[10px] text-indigo-400 font-bold">
                                {selectedShowIds.length === eventShows.length ? "DESELECT ALL" : "SELECT ALL"}
                            </button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                            {eventShows.map((show) => (
                                <div 
                                    key={show.id}
                                    onClick={() => toggleShowSelection(show.id)}
                                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                        selectedShowIds.includes(show.id) ? 'bg-indigo-500/10 border-indigo-500' : 'bg-slate-950 border-slate-800'
                                    }`}
                                >
                                    <div>
                                        <p className="text-[10px] font-bold flex items-center gap-1"><Calendar size={12}/> {new Date(show.start_time).toLocaleString()}</p>
                                        <p className="text-[10px] text-slate-500 flex items-center gap-1"><Users size={12}/> Capacity: {show.capacity}</p>
                                    </div>
                                    {selectedShowIds.includes(show.id) ? <CheckCircle2 size={16} className="text-indigo-400" /> : <Circle size={16} className="text-slate-700" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dimensions Card */}
                    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                        <h2 className="text-sm font-bold uppercase text-slate-500 mb-4 flex items-center gap-2">
                            <LayoutGrid size={16} /> Grid Size
                        </h2>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase text-slate-500 font-bold">Rows</label>
                                <input type="number" value={rows} onChange={(e) => setRows(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase text-slate-500 font-bold">Cols</label>
                                <input type="number" value={cols} onChange={(e) => setCols(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none" />
                            </div>
                        </div>
                        <button onClick={generateGrid} className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs transition-all">Clear Grid</button>
                    </div>

                    {/* Category Management Card */}
                    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-bold uppercase text-slate-500 tracking-widest">Categories</h2>
                            <button onClick={addSection} className="p-1 bg-indigo-600 rounded-full"><Plus size={14} /></button>
                        </div>
                        <div className="space-y-2">
                            {sections.map((sec, idx) => (
                                <div key={idx}
                                    className={`p-2 rounded-lg border-2 transition-all cursor-pointer ${selectedSectionIndex === idx && mode === 'seat' ? 'border-white' : 'border-slate-800'}`}
                                    style={{ backgroundColor: `${sec.color}15` }}
                                    onClick={() => { setMode("seat"); setSelectedSectionIndex(idx); }}
                                >
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={sec.color} onChange={(e) => updateSection(idx, 'color', e.target.value)} className="w-4 h-4 rounded cursor-pointer bg-transparent border-none" />
                                        <input type="text" value={sec.name} onChange={(e) => updateSection(idx, 'name', e.target.value)} className="bg-transparent text-xs font-bold w-full outline-none" />
                                        <button onClick={() => deleteSection(idx)} className="text-slate-500 hover:text-red-400"><Trash2 size={12} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Canvas Area */}
                <main className="col-span-9 flex flex-col">
                    <header className="flex justify-between items-center mb-6 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                        <div className="flex gap-4 items-center">
                            <div className="flex gap-2 bg-slate-950 p-1 rounded-xl">
                                <button onClick={() => setMode("seat")} className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${mode === 'seat' ? 'bg-indigo-600' : 'text-slate-400'}`}>
                                    <MousePointer2 size={14} /> Seats
                                </button>
                                <button onClick={() => setMode("aisle")} className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${mode === 'aisle' ? 'bg-slate-700' : 'text-slate-400'}`}>
                                    <Square size={14} /> Aisle
                                </button>
                                <button onClick={() => setMode("empty")} className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${mode === 'empty' ? 'bg-red-900/40' : 'text-slate-400'}`}>
                                    <Eraser size={14} /> Eraser
                                </button>
                            </div>
                            
                            <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${isOverCapacity ? 'border-red-500 bg-red-500/10' : 'border-slate-800 bg-slate-950'}`}>
                                <div>
                                    <p className="text-[10px] uppercase text-slate-500 font-bold">Total Painted</p>
                                    <p className={`text-sm font-black ${isOverCapacity ? 'text-red-400' : 'text-white'}`}>{currentSeatCount} / {minSelectedCapacity === Infinity ? '--' : minSelectedCapacity}</p>
                                </div>
                                {isOverCapacity && <AlertCircle size={18} className="text-red-500 animate-pulse" />}
                            </div>
                        </div>

                        <button 
                            onClick={handleSave} 
                            disabled={selectedShowIds.length === 0 || isOverCapacity} 
                            className="px-8 py-2 bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all"
                        >
                            Publish Layout
                        </button>
                    </header>

                    {/* Grid Canvas */}
                    <div className="flex-1 bg-slate-950 rounded-3xl border border-slate-800 p-12 overflow-auto flex flex-col items-center">
                        <div className="w-2/3 h-2 bg-indigo-500/20 rounded-full mb-16 shadow-[0_0_30px_rgba(99,102,241,0.3)] flex items-center justify-center">
                            <span className="text-[10px] text-indigo-400 font-black tracking-[1em] mt-8 uppercase">Stage / Screen</span>
                        </div>

                        <div className="inline-block bg-slate-900/30 p-8 rounded-xl ring-1 ring-slate-800">
                            {grid.map((row, r) => (
                                <div key={r} className="flex items-center gap-1.5 mb-1.5">
                                    <div className="w-8 text-[11px] font-black text-slate-600 text-center uppercase tracking-tighter">{String.fromCharCode(65 + r)}</div>
                                    {row.map((cell, c) => (
                                        <div
                                            key={c}
                                            onMouseDown={() => { setIsMouseDown(true); updateCell(r, c); }}
                                            onMouseEnter={() => { if (isMouseDown) updateCell(r, c); }}
                                            style={{
                                                backgroundColor: cell.seat_type === 'seat' ? sections[cell.section_index]?.color :
                                                                 cell.seat_type === 'aisle' ? '#334155' : 'transparent',
                                                border: cell.seat_type === 'empty' ? '1px solid #1e293b' : 'none'
                                            }}
                                            className={`w-8 h-8 rounded-md transition-all duration-75 select-none relative group cursor-crosshair
                                                ${cell.seat_type === 'seat' ? 'shadow-lg ring-1 ring-white/20' : ''}
                                                ${cell.seat_type === 'empty' ? 'hover:bg-slate-800' : ''}`}
                                        >
                                            {cell.seat_type === 'seat' && (
                                                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-black/40 uppercase">
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
    );
};

export default SeatLayoutBuilder;