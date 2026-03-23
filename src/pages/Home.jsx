import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../store/auth/authThunks";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  return (
    <div className="dark bg-background-dark min-h-screen flex flex-col text-white font-display">
      <Navbar />

      <main className="flex-1">
        {/* 🔥 HERO SECTION */}
        <section className="px-6 py-24 text-center max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6 text-white">
              FIND YOUR PERFECT <br />
              <span className="text-blue-600">SEAT</span>
            </h1>

            <p className="mt-8 text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
              Book events with smart seat selection, real-time availability, and
              seamless OTP-based secure authentication.
            </p>
          </div>

          {/* CTA Buttons - Hidden if authenticated */}
          {!isAuthenticated && (
            <div className="mt-12 flex justify-center gap-4 flex-wrap">
              <Link
                to="/register"
                className="px-8 py-3.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all uppercase tracking-wider text-sm"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="px-8 py-3.5 rounded-lg bg-[#1E1E1E] border border-slate-800 text-white font-semibold hover:bg-slate-800 transition-all text-sm"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Active Indicator */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2 bg-[#1E1E1E] px-4 py-2 rounded-full border border-slate-800">
              <div className="size-2 rounded-full bg-blue-600 animate-pulse"></div>
              <span className="text-xs font-medium text-white">
                Platform Active & Ready
              </span>
            </div>
          </div>
        </section>

        {/* 🔥 FEATURES SECTION */}
        <section className="px-6 py-20 bg-[#121212] border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                Features
              </span>
              <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mt-4 mb-6 text-white">
                WHY CHOOSE US
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Experience the next generation of booking with cutting-edge
                features designed for you.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <div className="group flex flex-col bg-[#1E1E1E] border border-slate-800 rounded-xl p-8 hover:border-blue-600/50 transition-all duration-300">
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-blue-600/10 text-blue-600 mb-6">
                  <span className="material-symbols-outlined text-3xl">event_seat</span>
                </div>
                <h3 className="text-xl font-extrabold leading-tight text-white mb-4 group-hover:text-blue-600 transition-colors">
                  Smart Seat Selection
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Visual seat layouts with real-time availability so you always
                  choose exactly where you want to sit.
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="group flex flex-col bg-[#1E1E1E] border border-slate-800 rounded-xl p-8 hover:border-blue-600/50 transition-all duration-300">
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-blue-600/10 text-blue-600 mb-6">
                  <span className="material-symbols-outlined text-3xl">lock</span>
                </div>
                <h3 className="text-xl font-extrabold leading-tight text-white mb-4 group-hover:text-blue-600 transition-colors">
                  Secure OTP Authentication
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Multi-layered authentication with OTP verification ensuring
                  safe and trusted bookings.
                </p>
              </div>

              {/* Feature Card 3 */}
              <div className="group flex flex-col bg-[#1E1E1E] border border-slate-800 rounded-xl p-8 hover:border-blue-600/50 transition-all duration-300">
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-blue-600/10 text-blue-600 mb-6">
                  <span className="material-symbols-outlined text-3xl">bolt</span>
                </div>
                <h3 className="text-xl font-extrabold leading-tight text-white mb-4 group-hover:text-blue-600 transition-colors">
                  Fast & Seamless Booking
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Optimized backend architecture powered by FastAPI and React
                  for high-performance booking experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 STATS SECTION */}
        <section className="px-6 py-20 bg-background-dark">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-blue-600 mb-2">50K+</div>
                <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-blue-600 mb-2">200K+</div>
                <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">Bookings Made</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-blue-600 mb-2">1000+</div>
                <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">Events Hosted</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-blue-600 mb-2">24/7</div>
                <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 CTA SECTION */}
        <section className="px-6 py-24 text-center bg-[#1E1E1E] border-y border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-white">
              READY TO RESERVE <br />YOUR SEAT?
            </h2>

            <p className="mt-6 text-slate-400 text-lg">
              Create an account and start booking instantly.
            </p>

            {!isAuthenticated && (
              <Link
                to="/register"
                className="inline-flex items-center gap-2 mt-10 px-10 py-4 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all uppercase tracking-wider text-sm"
              >
                Create Account
                <span className="material-symbols-outlined">arrow_forward</span>
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