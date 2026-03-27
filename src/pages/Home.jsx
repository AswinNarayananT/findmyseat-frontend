import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../store/auth/authThunks";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Armchair, ShieldCheck, Zap, ArrowRight, Play } from "lucide-react";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col text-slate-200">
      <Navbar />

      <main className="flex-1">
        {/* 🔥 HERO SECTION */}
        <section className="relative px-6 py-24 md:py-32 text-center max-w-7xl mx-auto overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Next-Gen Booking Platform
            </div>

            <h1 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8 text-white">
              FIND YOUR PERFECT <br />
              <span className="text-indigo-600">SEAT</span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Experience smart seat selection with real-time availability and 
              secure authentication. The future of event booking is here.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/public-events"
              className="px-10 py-4 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-500 transition-all uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 flex items-center gap-3 group"
            >
              Explore Events
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {!isAuthenticated && (
              <Link
                to="/login"
                className="px-10 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-black hover:bg-slate-800 transition-all uppercase tracking-widest text-xs flex items-center gap-3"
              >
                Join Now
              </Link>
            )}
          </div>
        </section>

        {/* 🔥 FEATURES SECTION */}
        <section className="px-6 py-24 bg-slate-950 border-t border-slate-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6 uppercase">
                WHY CHOOSE US
              </h2>
              <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <div className="group bg-slate-900/40 border border-slate-800 p-10 rounded-[40px] hover:border-indigo-600/40 transition-all duration-500 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 mb-8 group-hover:scale-110 transition-transform">
                  <Armchair size={32} />
                </div>
                <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">
                  Smart Selection
                </h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Interactive visual layouts with instant locking. See exactly where you'll sit before you pay.
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="group bg-slate-900/40 border border-slate-800 p-10 rounded-[40px] hover:border-indigo-600/40 transition-all duration-500 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 mb-8 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">
                  OTP Security
                </h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Multi-layered verification ensuring every booking is legitimate and every account is secure.
                </p>
              </div>

              {/* Feature Card 3 */}
              <div className="group bg-slate-900/40 border border-slate-800 p-10 rounded-[40px] hover:border-indigo-600/40 transition-all duration-500 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 mb-8 group-hover:scale-110 transition-transform">
                  <Zap size={32} />
                </div>
                <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">
                  Ultra Fast
                </h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Powered by FastAPI and React for millisecond response times. No more lag during high-demand drops.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 STATS SECTION */}
        <section className="px-6 py-20 bg-[#020617]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { label: "Active Users", val: "50K+" },
                { label: "Bookings Made", val: "200K+" },
                { label: "Events Hosted", val: "1000+" },
                { label: "Uptime", val: "99.9%" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tighter italic">
                    {stat.val}
                  </div>
                  <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🔥 CTA SECTION */}
        <section className="relative px-6 py-32 text-center bg-slate-950 border-y border-slate-900 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full" />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black leading-[1] tracking-tighter text-white uppercase mb-8">
              READY TO RESERVE <br />YOUR EXPERIENCE?
            </h2>

            <p className="text-slate-400 text-lg font-medium mb-12">
              Don't miss out. Join thousands of users booking events daily.
            </p>

            {!isAuthenticated ? (
              <Link
                to="/login"
                className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-500 transition-all uppercase tracking-widest text-sm shadow-xl shadow-indigo-600/30 group"
              >
                Create Account
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                to="/public-events"
                className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl bg-white text-black font-black hover:bg-slate-200 transition-all uppercase tracking-widest text-sm"
              >
                Browse Events
                <Play size={18} fill="currentColor" />
              </Link>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;