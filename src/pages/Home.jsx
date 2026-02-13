import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Home() {
  // Get user from Redux store
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="dark bg-background-dark min-h-screen flex flex-col text-white font-display">
      <Navbar />

      <main className="flex-1">
        {/* 🔥 HERO SECTION */}
        <section className="px-6 py-24 text-center max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6">
              FIND YOUR PERFECT <br />
              <span className="text-primary">SEAT</span>
            </h1>

            <p className="mt-8 text-[#9ca6ba] text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
              Book events with smart seat selection,
              real-time availability, and seamless OTP-based secure authentication.
            </p>
          </div>

          {/* CTA Buttons - Only show if not authenticated */}
          {!isAuthenticated && (
            <div className="mt-12 flex justify-center gap-4 flex-wrap">
              <Link
                to="/register"
                className="px-8 py-3.5 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-all uppercase tracking-wider text-sm"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="px-8 py-3.5 rounded-lg bg-[#1E1E1E] border border-[#282e39] text-white font-semibold hover:bg-[#282e39] transition-all text-sm"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Active Indicator */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2 bg-[#1E1E1E] px-4 py-2 rounded-full border border-[#282e39]">
              <div className="size-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-xs font-medium text-white">Platform Active & Ready</span>
            </div>
          </div>
        </section>

        {/* 🔥 FEATURES SECTION */}
        <section className="px-6 py-20 bg-card-dark border-t border-[#282e39]">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Features</span>
              <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mt-4 mb-6">
                WHY CHOOSE US
              </h2>
              <p className="text-[#9ca6ba] text-lg max-w-2xl mx-auto">
                Experience the next generation of booking with cutting-edge features designed for you.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <div className="group flex flex-col bg-[#1E1E1E] border border-[#282e39] rounded-xl p-8 hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10 text-primary mb-6">
                  <span className="material-symbols-outlined text-3xl">event_seat</span>
                </div>
                <h3 className="text-xl font-extrabold leading-tight text-white mb-4 group-hover:text-primary transition-colors">
                  Smart Seat Selection
                </h3>
                <p className="text-[#9ca6ba] text-sm leading-relaxed">
                  Visual seat layouts with real-time availability so you always
                  choose exactly where you want to sit.
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="group flex flex-col bg-[#1E1E1E] border border-[#282e39] rounded-xl p-8 hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10 text-primary mb-6">
                  <span className="material-symbols-outlined text-3xl">lock</span>
                </div>
                <h3 className="text-xl font-extrabold leading-tight text-white mb-4 group-hover:text-primary transition-colors">
                  Secure OTP Authentication
                </h3>
                <p className="text-[#9ca6ba] text-sm leading-relaxed">
                  Multi-layered authentication with OTP verification ensuring
                  safe and trusted bookings.
                </p>
              </div>

              {/* Feature Card 3 */}
              <div className="group flex flex-col bg-[#1E1E1E] border border-[#282e39] rounded-xl p-8 hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10 text-primary mb-6">
                  <span className="material-symbols-outlined text-3xl">bolt</span>
                </div>
                <h3 className="text-xl font-extrabold leading-tight text-white mb-4 group-hover:text-primary transition-colors">
                  Fast & Seamless Booking
                </h3>
                <p className="text-[#9ca6ba] text-sm leading-relaxed">
                  Optimized backend architecture powered by FastAPI and React
                  for high-performance booking experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 STATS SECTION */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-primary mb-2">50K+</div>
                <div className="text-[#9ca6ba] text-sm font-medium uppercase tracking-wider">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-primary mb-2">200K+</div>
                <div className="text-[#9ca6ba] text-sm font-medium uppercase tracking-wider">Bookings Made</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-primary mb-2">1000+</div>
                <div className="text-[#9ca6ba] text-sm font-medium uppercase tracking-wider">Routes Available</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-primary mb-2">24/7</div>
                <div className="text-[#9ca6ba] text-sm font-medium uppercase tracking-wider">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 CTA SECTION */}
        <section className="px-6 py-24 text-center bg-card-dark border-y border-[#282e39]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
              READY TO RESERVE <br />YOUR SEAT?
            </h2>

            <p className="mt-6 text-[#9ca6ba] text-lg">
              Create an account and start booking instantly.
            </p>

            {!isAuthenticated && (
              <Link
                to="/register"
                className="inline-flex items-center gap-2 mt-10 px-10 py-4 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-all uppercase tracking-wider text-sm"
              >
                Create Account
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            )}
          </div>
        </section>

        {/* 🔥 HOW IT WORKS SECTION */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Process</span>
              <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mt-4">
                HOW IT WORKS
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white font-black text-2xl mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Choose Your Route</h3>
                <p className="text-[#9ca6ba] text-sm">
                  Browse available buses, trains, or events and select your preferred route or venue.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white font-black text-2xl mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">Select Your Seat</h3>
                <p className="text-[#9ca6ba] text-sm">
                  View the interactive seat map and pick your ideal seat in real-time.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white font-black text-2xl mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Confirm & Book</h3>
                <p className="text-[#9ca6ba] text-sm">
                  Complete secure OTP verification and receive your booking confirmation instantly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;