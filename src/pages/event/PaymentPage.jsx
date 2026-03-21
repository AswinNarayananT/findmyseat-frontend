import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkActiveUserLock, verifyBookingPayment } from "../../store/event/eventThunk";
import { Ticket, Clock, ShieldCheck, ChevronLeft, CreditCard, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const PaymentPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [timeLeft, setTimeLeft] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const { activeLock, loading } = useSelector((state) => state.event);

  // Helper to load Razorpay SDK dynamically
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
    
    // 1. Ensure SDK is loaded
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Razorpay SDK failed to load. Check your connection.");
      setIsVerifying(false);
      return;
    }

    // 2. Open Modal
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

  // Improved loading logic to prevent "No Active Session" flicker
  if (loading || activeLock === null) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
        <p className="font-black uppercase tracking-widest text-xs">Securing your session...</p>
      </div>
    );
  }

  if (activeLock?.has_active_lock === false) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white p-6 text-center">
        <h1 className="text-2xl font-black mb-4">No Active Session</h1>
        <p className="text-slate-400 mb-8 max-w-md">Your session may have expired or you haven't selected any seats yet. Seats are only held for 10 minutes.</p>
        <button 
          onClick={() => navigate(`/booking/seats/${showId}`)} 
          className="bg-indigo-600 hover:bg-indigo-500 transition-colors px-8 py-3 rounded-2xl font-bold"
        >
          Return to Seat Selection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors font-bold">
          <ChevronLeft size={20}/> Modify Seats
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8 backdrop-blur-md">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Checkout</h1>
                  <p className="text-slate-400 text-sm flex items-center gap-2 font-medium">
                    <Ticket size={16} className="text-indigo-400"/> {activeLock.seat_count} Seats Reserved
                  </p>
                </div>
                {timeLeft !== null && (
                  <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-2xl flex items-center gap-3">
                    <Clock size={18} className="text-red-500 animate-pulse"/>
                    <span className="font-mono font-bold text-red-500 text-lg">{formatTime(timeLeft)}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4 border-t border-slate-800 pt-8">
                <div className="flex justify-between text-slate-400 text-sm font-bold uppercase tracking-wider">
                  <span>Ticket Subtotal</span>
                  <span className="text-white">₹{activeLock.total_price}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm font-bold uppercase tracking-wider">
                  <span>Service Fee</span>
                  <span className="text-emerald-500">FREE</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-white pt-4 border-t border-slate-800">
                  <span>Total Amount</span>
                  <span className="text-indigo-400">₹{activeLock.total_price}</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-[32px] p-6 flex items-start gap-4">
              <ShieldCheck className="text-indigo-400 mt-1" size={24}/>
              <div>
                <p className="text-sm font-bold text-indigo-200 uppercase tracking-widest">Secure Payment</p>
                <p className="text-xs text-indigo-300/60 leading-relaxed mt-1">
                  Your payment is processed through Razorpay's PCI-compliant gateway. Seats are held exclusively for you until the timer hits zero.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl sticky top-8">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6">
                <CreditCard size={24}/>
              </div>
              <h3 className="text-lg font-black text-white mb-2">Ready to Pay?</h3>
              <p className="text-sm text-slate-400 mb-8">Click below to open the secure payment portal and complete your booking.</p>
              
              <button 
                onClick={handlePayNow}
                disabled={isVerifying}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isVerifying && <Loader2 className="animate-spin" size={20} />}
                {isVerifying ? "VERIFYING..." : `PAY ₹${activeLock.total_price}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;