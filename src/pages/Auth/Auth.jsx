import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background-dark font-display text-white">
      
      {/* Header */}
    <Navbar />


      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[440px] bg-card-dark border border-border-dark rounded-xl p-8 shadow-2xl">
          
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-[28px] font-bold">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-gray-400 text-sm">
              {mode === "login"
                ? "Enter your details to access your account"
                : "Fill the details to get started"}
            </p>
          </div>

          {/* Mode Switch */}
          <div className="flex mb-8">
            <div className="flex h-11 flex-1 bg-input-dark border border-border-dark rounded-lg p-1">
              {["login", "register"].map((item) => (
                <button
                  key={item}
                  onClick={() => setMode(item)}
                  className={`flex-1 rounded-md text-sm font-medium transition-all
                    ${
                      mode === item
                        ? "bg-background-dark text-white"
                        : "text-gray-500"
                    }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                className="mt-2 w-full h-12 px-4 rounded-lg bg-input-dark border border-border-dark text-white placeholder-gray-600 focus:ring-1 focus:ring-white/40 outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">
                  Password
                </label>
                {mode === "login" && (
                  <a
                    href="#"
                    className="text-xs text-gray-500 hover:text-white"
                  >
                    Forgot?
                  </a>
                )}
              </div>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full h-12 px-4 pr-12 rounded-lg bg-input-dark border border-border-dark text-white placeholder-gray-600 focus:ring-1 focus:ring-white/40 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember */}
            {mode === "login" && (
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 accent-white" />
                <span className="text-gray-400 text-xs">
                  Keep me logged in for 30 days
                </span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-12 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition"
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="border-t border-border-dark" />
            <span className="absolute inset-0 -top-2 flex justify-center bg-card-dark px-2 text-xs text-gray-500">
              Or continue with
            </span>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-4">
            {["Google", "Facebook"].map((provider) => (
              <button
                key={provider}
                className="h-11 rounded-lg border border-border-dark bg-input-dark text-xs font-medium hover:bg-border-dark transition"
              >
                {provider}
              </button>
            ))}
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-500">
            {mode === "login" ? (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-white font-medium hover:underline"
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-white font-medium hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
