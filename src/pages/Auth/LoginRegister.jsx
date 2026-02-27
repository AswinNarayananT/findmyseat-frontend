import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function LoginRegister() {
  return (
    <div className="dark bg-background-dark min-h-screen flex flex-col text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[440px] bg-card-dark border border-border-dark rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-[28px] font-bold tracking-tight">
              Welcome back
            </h1>
            <p className="text-gray-400 text-sm">
              Enter your details to access your account
            </p>
          </div>

          <div className="flex mb-8">
            <div className="flex h-11 flex-1 rounded-lg bg-input-dark border border-border-dark p-1">
              <button className="flex-1 rounded-md bg-background-dark text-sm font-medium">
                Login
              </button>
              <button className="flex-1 rounded-md text-gray-500 text-sm">
                Register
              </button>
            </div>
          </div>

          <form className="space-y-5">
            <div>
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                className="mt-2 w-full h-12 rounded-lg bg-input-dark border border-border-dark px-4 text-sm placeholder:text-gray-600 focus:ring-1 focus:ring-white/50"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between">
                <label className="text-sm font-medium">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-gray-500 hover:text-white transition"
                >
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                className="mt-2 w-full h-12 rounded-lg bg-input-dark border border-border-dark px-4 text-sm placeholder:text-gray-600 focus:ring-1 focus:ring-white/50"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded bg-input-dark" />
              <span className="text-xs text-gray-400">
                Keep me logged in for 30 days
              </span>
            </div>

            <button className="w-full h-12 rounded-lg bg-primary text-background-dark font-bold text-sm hover:bg-gray-200">
              Sign In
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-dark"></div>
            </div>
            <div className="relative text-center">
              <span className="bg-card-dark px-2 text-xs text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="h-11 rounded-lg border border-border-dark bg-input-dark text-xs hover:bg-border-dark">
              Google
            </button>
            <button className="h-11 rounded-lg border border-border-dark bg-input-dark text-xs hover:bg-border-dark">
              Facebook
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-gray-500">
            Don&apos;t have an account?{" "}
            <span className="text-white font-medium cursor-pointer">
              Create an account
            </span>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LoginRegister;
