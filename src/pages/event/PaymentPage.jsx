import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkActiveUserLock, verifyBookingPayment } from "../../store/event/eventThunk";
import { Ticket, Clock, ShieldCheck, ChevronLeft, CreditCard, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const PaymentPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [timeLeft, setTimeLeft] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const { activeLock, loading } = useSelector((state) => state.event);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    dispatch(checkActiveUserLock());
  }, [dispatch]);

  useEffect(() => {
    if (activeLock?.has_active_lock && activeLock?.expires_at) {
      const interval = setInterval(() => {
        const expiry = new Date(activeLock.expires_at).getTime();
        const now = new Date().getTime();
        const diff = Math.max(0, Math.floor((expiry - now) / 1000));
        
        setTimeLeft(diff);
        if (diff <= 0) {
          clearInterval(interval);
          toast.error("Session expired. Seats released.");
          navigate(`/booking/seats/${showId}`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeLock, navigate, showId]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handlePayNow = async () => {
    setIsVerifying(true);
    
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Razorpay SDK failed to load. Check your connection.");
      setIsVerifying(false);
      return;
    }

    const options = {
      key: activeLock.key_id || "rzp_test_atDMV07p8I1XuT", 
      amount: activeLock.total_price * 100,
      currency: "INR",
      name: "FindMySeat",
      description: `Payment for ${activeLock.seat_count} tickets`,
      order_id: activeLock.razorpay_order_id, 
      handler: async (response) => {
        try {
          await dispatch(verifyBookingPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          })).unwrap();
          
          toast.success("Booking Confirmed!");
          navigate("/profile/bookings");
        } catch (err) {
          toast.error(err || "Payment verification failed");
          setIsVerifying(false);
        }
      },
      modal: { 
        ondismiss: () => setIsVerifying(false) 
      },
      theme: { color: "#6366f1" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (loading || activeLock === null) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-white">
          <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
          <p className="font-black uppercase tracking-widest text-[10px] opacity-50">Securing your session...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (activeLock?.has_active_lock === false) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-white p-6 text-center">
          <div className="size-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          <h1 className="text-3xl font-black mb-4 uppercase tracking-tighter italic">No Active Session</h1>
          <p className="text-slate-400 mb-8 max-w-md font-medium text-sm leading-relaxed">
            Your session may have expired or you haven't selected any seats yet. 
            Seats are only held for 10 minutes to ensure fairness for other users.
          </p>
          <button 
            onClick={() => navigate(`/booking/seats/${showId}`)} 
            className="bg-indigo-600 hover:bg-indigo-500 transition-all px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20"
          >
            Return to Seat Selection
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-6 md:p-12 text-slate-200 selection:bg-indigo-500/30">
        <div className="max-w-5xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-slate-500 hover:text-white mb-4 transition-colors font-black text-[10px] uppercase tracking-widest"
              >
                <ChevronLeft size={16}/> Modify Seats
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">Checkout</h1>
            </div>
            {timeLeft !== null && (
              <div className="bg-red-500/10 border border-red-500/20 px-6 py-4 rounded-3xl flex items-center gap-4 shadow-xl shadow-red-950/20">
                <div className="flex flex-col items-end">
                   <span className="text-[9px] font-black text-red-500/60 uppercase tracking-widest">Time Remaining</span>
                   <span className="font-mono font-black text-red-500 text-2xl leading-none">{formatTime(timeLeft)}</span>
                </div>
                <Clock size={24} className="text-red-500 animate-pulse"/>
              </div>
            )}
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-md shadow-2xl">
                <div className="flex items-center gap-4 mb-10">
                   <div className="size-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                      <Ticket size={24}/>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Booking Summary</p>
                      <h3 className="text-xl font-black text-white">{activeLock.seat_count} Premium Seats Reserved</h3>
                   </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center group">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">Ticket Subtotal</span>
                    <span className="font-black text-white">₹{activeLock.total_price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center group">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">Convenience Fee</span>
                    <span className="text-emerald-500 font-black text-xs uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">FREE</span>
                  </div>
                  
                  <div className="pt-8 border-t border-slate-800 flex justify-between items-end">
                    <div>
                       <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Payable</p>
                       <span className="text-4xl font-black text-white italic tracking-tighter">₹{activeLock.total_price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-[2.5rem] p-8 flex items-start gap-6">
                <div className="size-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/20">
                  <ShieldCheck size={24}/>
                </div>
                <div>
                  <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-2">Encrypted Security</p>
                  <p className="text-sm text-indigo-300/60 leading-relaxed font-medium italic">
                    Your payment is processed through Razorpay's PCI-compliant infrastructure. 
                    Your seat lock is strictly exclusive to your account until the countdown expires.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl sticky top-32">
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-indigo-400 mb-8 border border-white/5">
                  <CreditCard size={32}/>
                </div>
                <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter italic">Final Step</h3>
                <p className="text-slate-400 mb-10 text-sm leading-relaxed font-medium">
                   Proceed to our secure payment gateway to finalize your tickets. 
                   Ensure you complete the process before the timer hits zero.
                </p>
                
                <button 
                  onClick={handlePayNow}
                  disabled={isVerifying}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      VERIFYING...
                    </>
                  ) : (
                    `SECURE PAY • ₹${activeLock.total_price.toLocaleString()}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentPage;