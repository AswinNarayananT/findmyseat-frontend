import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock, FaUser, FaShieldAlt } from "react-icons/fa";
import { adminLogin } from "../../store/admin/adminAuthThunks";
import { z } from "zod";

function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.adminAuth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // ✅ Zod Schema
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Zod Validation
    const validation = loginSchema.safeParse(formData);

    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    try {
      await dispatch(adminLogin(formData)).unwrap();

      // ✅ Navigate on success
      navigate("/admin/dashboard");

    } catch (err) {
      setError(err || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#080B10] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#0d59f2 1px, transparent 1px), linear-gradient(90deg, #0d59f2 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Back to site link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-[#505a6b] hover:text-white transition-colors text-sm font-medium"
      >
        <span>←</span> Back to site
      </Link>

      <div className="relative w-full max-w-md">
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent rounded-t-xl" />

        <div className="bg-[#0F1318] border border-[#1a2030] border-t-0 rounded-b-xl p-8 shadow-2xl shadow-black/60">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 mb-4">
              <FaShieldAlt className="text-primary text-2xl" />
            </div>
            <h1 className="text-white text-2xl font-black tracking-tight uppercase">
              Admin Portal
            </h1>
            <p className="text-[#505a6b] text-sm mt-2">
              Restricted access — authorized personnel only
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <span className="text-red-400 text-xs font-bold uppercase tracking-wider">
                {error}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[#9ca6ba] text-xs font-bold uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#505a6b] text-sm" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#0D1117] border border-[#1e2837] rounded-lg h-12 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-[#9ca6ba] text-xs font-bold uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#505a6b] text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#0D1117] border border-[#1e2837] rounded-lg h-12 pl-10 pr-12 text-white text-sm focus:outline-none focus:border-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#505a6b] hover:text-white"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full h-12 bg-primary text-white font-black uppercase tracking-widest text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Access Dashboard"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#1a2030] text-center">
            <p className="text-[#505a6b] text-xs">
              FindMySeat Admin Console • v1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
