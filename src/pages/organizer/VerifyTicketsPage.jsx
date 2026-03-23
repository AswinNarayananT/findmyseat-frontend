import React, { useEffect, useReducer, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Html5Qrcode } from "html5-qrcode";
import { verifyTicketQR } from "../../store/organizer/organizerThunk";
import { ChevronLeft, CheckCircle2, XCircle, Loader2, Scan } from "lucide-react";

const SCANNER_ID = "qr-reader";

const initialState = {
  phase: "scanning",
  result: null,
  errorMessage: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "VERIFYING":
      return { ...state, phase: "verifying" };
    case "SUCCESS":
      return { ...state, phase: "success", result: action.payload };
    case "ERROR":
      return { ...state, phase: "error", errorMessage: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const VerifyTicketsPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [state, localDispatch] = useReducer(reducer, initialState);

  const scannerRef = useRef(null);
  const isMountedRef = useRef(true);
  const isStartingRef = useRef(false);
  const hasScannedRef = useRef(false);
  const onScanSuccessRef = useRef(null);

  // ── Stop helper ───────────────────────────────────────────────────────────
  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;
    try {
      if (scanner.isScanning) await scanner.stop();
      scanner.clear();
    } catch (err) {
      console.warn("Scanner stop error:", err);
    } finally {
      scannerRef.current = null;
    }
  }, []);

  // ── Scan callback via ref (always fresh, never stale) ─────────────────────
  onScanSuccessRef.current = async (decodedText) => {
    if (hasScannedRef.current || !isMountedRef.current) return;
    hasScannedRef.current = true;

    new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3")
      .play()
      .catch(() => {});

    await stopScanner();
    if (!isMountedRef.current) return;

    localDispatch({ type: "VERIFYING" });

    try {
      // Pass both showId and scanned bookingId to the thunk
      const result = await dispatch(verifyTicketQR({ showId, bookingId: decodedText })).unwrap();
      if (isMountedRef.current) localDispatch({ type: "SUCCESS", payload: result });
    } catch (error) {
      if (isMountedRef.current)
        localDispatch({ type: "ERROR", payload: error?.message || String(error) });
    }
  };

  // ── Start scanner ─────────────────────────────────────────────────────────
  const startScanner = useCallback(async () => {
    if (isStartingRef.current || scannerRef.current) return;
    isStartingRef.current = true;
    hasScannedRef.current = false;

    const el = document.getElementById(SCANNER_ID);
    if (!el) { isStartingRef.current = false; return; }

    try {
      const scanner = new Html5Qrcode(SCANNER_ID);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: (w, h) => {
            const size = Math.min(w, h) * 0.6;
            return { width: size, height: size };
          },
          aspectRatio: 1.0,
          disableFlip: false,
        },
        (decodedText) => onScanSuccessRef.current(decodedText)
      );
    } catch (err) {
      console.error("Camera start error:", err);
      scannerRef.current = null;
      if (isMountedRef.current)
        localDispatch({ type: "ERROR", payload: "Camera access denied or unavailable." });
    } finally {
      isStartingRef.current = false;
    }
  }, [stopScanner]);

  // ── Mount / unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    isMountedRef.current = true;

    const timer = setTimeout(() => {
      if (isMountedRef.current && state.phase === "scanning") startScanner();
    }, 100);

    const handleBeforeUnload = () => stopScanner();
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      isMountedRef.current = false;
      clearTimeout(timer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Restart after reset ───────────────────────────────────────────────────
  useEffect(() => {
    if (state.phase === "scanning") {
      const timer = setTimeout(() => {
        if (isMountedRef.current) startScanner();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [state.phase, startScanner]);

  const handleBack = async () => { await stopScanner(); navigate(-1); };
  const handleReset = async () => { await stopScanner(); localDispatch({ type: "RESET" }); };

  const isScanning = state.phase === "scanning";
  const details = state.result?.details;
  const seatList = details?.seats
    ? details.seats.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900/50 border border-slate-800 rounded-[48px] p-6 md:p-12 shadow-2xl backdrop-blur-sm">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <button onClick={handleBack} className="p-3 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="text-right">
            <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">Gate Entry</h1>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic">Live Camera</p>
          </div>
        </div>

        {/* Scanner Box */}
        <div className={`relative aspect-square w-full max-w-[450px] mx-auto overflow-hidden rounded-[40px] border-4 transition-all duration-700 ${
          state.phase === "verifying" ? "border-indigo-500 scale-95"
          : state.phase === "success"  ? "border-emerald-500"
          : state.phase === "error"    ? "border-red-500"
          : "border-slate-800"
        }`}>
          {/* Always in DOM */}
          <div id={SCANNER_ID} className={`w-full h-full ${isScanning ? "block" : "hidden"}`} />

          {!isScanning && (
            <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-8 text-center space-y-6 overflow-y-auto">

              {/* Verifying */}
              {state.phase === "verifying" && (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin text-indigo-500" size={64} />
                  <p className="font-black text-indigo-400 animate-pulse tracking-widest uppercase">Validating...</p>
                </div>
              )}

              {/* Success */}
              {state.phase === "success" && (
                <div className="flex flex-col items-center space-y-5 w-full animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500/50">
                    <CheckCircle2 className="text-emerald-500" size={40} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">ACCESS GRANTED</h2>
                    <p className="text-emerald-400 font-bold uppercase tracking-widest mt-1 text-sm">{details?.user}</p>
                  </div>
                  <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 text-left space-y-4">
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Event</p>
                      <p className="text-white font-black text-sm">{details?.event}</p>
                    </div>
                    <div className="h-px bg-slate-800" />
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">
                        Seats ({details?.seats_count})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {seatList.map((label) => (
                          <span key={label} className="text-[11px] font-black px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={handleReset} className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-black uppercase tracking-widest transition-all">
                    Next Scan
                  </button>
                </div>
              )}

              {/* Error */}
              {state.phase === "error" && (
                <div className="flex flex-col items-center space-y-6 w-full animate-in zoom-in duration-300">
                  <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500/50">
                    <XCircle className="text-red-500" size={48} />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">INVALID TICKET</h2>
                  <p className="text-red-400 font-bold text-sm px-4 py-3 bg-red-500/10 rounded-xl w-full text-center">
                    {state.errorMessage}
                  </p>
                  <button onClick={handleReset} className="w-full bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-black transition-all">
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Scanning indicator */}
        {isScanning && (
          <div className="mt-8 flex justify-center items-center gap-4 bg-slate-900/50 py-3 px-6 rounded-2xl border border-slate-800 w-fit mx-auto">
            <Scan size={16} className="text-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auto-detect Active</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyTicketsPage;