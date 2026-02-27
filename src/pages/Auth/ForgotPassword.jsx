import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

function ForgotPassword() {
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setSuccessMessage("");

      await axios.post(
        "http://localhost:8000/api/v1/auth/forgot-password",
        data
      );

      setSuccessMessage(
        "If the email exists, a reset link has been sent."
      );
    } catch (err) {
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark bg-background-dark min-h-screen flex flex-col text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[440px] bg-card-dark border border-border-dark rounded-xl p-8 shadow-2xl">

          <div className="text-center mb-8">
            <h1 className="text-[28px] font-bold tracking-tight">
              Forgot Password
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Enter your email to receive a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div>
              <label>Email</label>
              <input
                {...register("email")}
                type="email"
                className="mt-2 w-full h-12 rounded-lg bg-input-dark border border-border-dark px-4"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>

            {successMessage && (
              <p className="text-green-500 text-sm text-center">
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg bg-primary text-background-dark font-bold text-sm hover:bg-gray-200 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ForgotPassword;