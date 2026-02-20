import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaClock, FaShieldAlt, FaEnvelope, FaArrowRight } from "react-icons/fa";

function ApplicationSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-dark text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">

        {/* Success Animation Container */}
        <div className="text-center mb-8">
          {/* Checkmark Icon with Animation */}
          <div className="relative inline-flex items-center justify-center mb-6">
            {/* Outer pulse rings */}
            <div className="absolute w-32 h-32 bg-emerald-500/20 rounded-full animate-ping"></div>
            <div className="absolute w-28 h-28 bg-emerald-500/30 rounded-full animate-pulse"></div>
            
            {/* Main icon */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/50">
              <FaCheckCircle className="text-white text-5xl" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4">
            Application Submitted!
          </h1>
          <p className="text-[#9ca6ba] text-lg">
            Thank you for applying to become an event organizer
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#1E1E1E] border border-[#282e39] rounded-xl overflow-hidden">
          
          {/* Status Banner */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-500/20 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                <FaClock className="text-amber-400 text-xl" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg mb-1">Verification Pending</h2>
                <p className="text-[#9ca6ba] text-sm leading-relaxed">
                  Your application is currently under review by our admin team. We'll notify you once the verification process is complete.
                </p>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="p-8">
            <h3 className="text-white font-black uppercase tracking-tight text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary"></span>
              What Happens Next?
            </h3>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary">
                  1
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">Admin Review</h4>
                  <p className="text-[#9ca6ba] text-sm leading-relaxed">
                    Our team will verify your organization details, contact information, and bank account credentials to ensure authenticity and security.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary">
                  2
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">Email Notification</h4>
                  <p className="text-[#9ca6ba] text-sm leading-relaxed">
                    You'll receive an email notification once your application has been approved. This typically takes 2-3 business days.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary">
                  3
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">Start Organizing</h4>
                  <p className="text-[#9ca6ba] text-sm leading-relaxed">
                    Once approved, you'll gain access to the organizer dashboard where you can create and manage events, track bookings, and handle payments.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Boxes */}
          <div className="px-8 pb-8 space-y-4">
            {/* Email Info */}
            <div className="bg-primary/5 border border-primary/10 p-4 rounded-lg flex gap-3">
              <FaEnvelope className="text-primary text-lg flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#9ca6ba]">
                  <span className="text-white font-semibold">Check your email inbox</span> regularly for updates on your application status. Make sure to check your spam folder as well.
                </p>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-lg flex gap-3">
              <FaShieldAlt className="text-emerald-400 text-lg flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#9ca6ba]">
                  <span className="text-white font-semibold">Your data is secure.</span> All information provided is encrypted and will only be used for verification purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#282e39]"></div>

          {/* Actions */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/")}
                className="h-12 px-6 bg-[#1c2127] border border-[#3b4754] text-white rounded-lg font-semibold hover:bg-[#282e39] transition-all flex items-center justify-center gap-2"
              >
                Back to Home
              </button>
              
              <button
                onClick={() => navigate("/organizer/dashboard")}
                className="h-12 px-6 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group"
              >
                Go to Dashboard
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <p className="text-center text-[#505a6b] text-xs mt-6">
              Need help? Contact us at{" "}
              <a href="mailto:support@findmyseat.com" className="text-primary hover:underline">
                support@findmyseat.com
              </a>
            </p>
          </div>
        </div>

        {/* Timeline Estimate */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1E1E1E] border border-[#282e39] rounded-full px-6 py-3">
            <FaClock className="text-amber-400" />
            <span className="text-sm text-[#9ca6ba]">
              Average verification time: <span className="text-white font-bold">2-3 business days</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ApplicationSuccess;