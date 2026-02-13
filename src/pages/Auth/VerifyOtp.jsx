import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "../../store/auth/authThunks";

const OTP_DURATION = 120; 

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const phoneNumber = localStorage.getItem("otp_phone");

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!phoneNumber) {
      navigate("/");
    }
  }, [phoneNumber, navigate]);


  useEffect(() => {
    let expiry = localStorage.getItem("otpExpiry");

    if (!expiry) {
      expiry = Date.now() + OTP_DURATION * 1000;
      localStorage.setItem("otpExpiry", expiry);
    }

    expiry = Number(expiry);

    const interval = setInterval(() => {
      const remaining = Math.floor((expiry - Date.now()) / 1000);

      if (remaining <= 0) {
        setTimeLeft(0);
        setExpired(true);
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) return;

    try {
      setLoading(true);

      await dispatch(
        verifyOtp({
          phone_number: phoneNumber,
          otp: otp,
        })
      ).unwrap();

      localStorage.removeItem("otp_phone");
      localStorage.removeItem("otpExpiry");

      navigate("/");
    } catch (error) {
      console.error("OTP verification failed:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleResend = async () => {
    try {
      setLoading(true);

      await dispatch(
        resendOtp({ phone_number: phoneNumber })
      ).unwrap();

      const newExpiry = Date.now() + OTP_DURATION * 1000;
      localStorage.setItem("otpExpiry", newExpiry);

      setExpired(false);
      setTimeLeft(OTP_DURATION);
    } catch (error) {
      console.error("Resend failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Verify OTP
        </h2>

        <form onSubmit={handleVerify} className="space-y-5">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
            maxLength={6}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {!expired && (
            <p className="text-sm text-gray-400 text-center">
              Expires in {formatTime(timeLeft)}
            </p>
          )}

          {!expired ? (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
