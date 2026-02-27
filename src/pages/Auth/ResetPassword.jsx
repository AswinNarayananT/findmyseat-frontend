import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Minimum 8 characters")
      .regex(/[A-Z]/, "Must contain uppercase letter")
      .regex(/[a-z]/, "Must contain lowercase letter")
      .regex(/[0-9]/, "Must contain number")
      .regex(/[^A-Za-z0-9]/, "Must contain special character"),
    confirm_password: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        path: ["confirm_password"],
        message: "Passwords do not match",
        code: z.ZodIssueCode.custom,
      });
    }
  });

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setErrorMessage("");

      await axios.post("http://localhost:8000/api/v1/auth/reset-password", {
        token: token,
        new_password: data.password,
      });

      setSuccessMessage("Password reset successfully! Redirecting...");

      setTimeout(() => {
        navigate("/login")
      }, 2000);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail || "Invalid or expired token"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="dark bg-background-dark min-h-screen flex items-center justify-center text-white">
        Invalid reset link.
      </div>
    );
  }

  return (
    <div className="dark bg-background-dark min-h-screen flex flex-col text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[440px] bg-card-dark border border-border-dark rounded-xl p-8 shadow-2xl">

          <div className="text-center mb-8">
            <h1 className="text-[28px] font-bold tracking-tight">
              Reset Password
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Enter your new secure password.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div>
              <label>New Password</label>
              <input
                {...register("password")}
                type="password"
                className="mt-2 w-full h-12 rounded-lg bg-input-dark border border-border-dark px-4"
              />
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label>Confirm Password</label>
              <input
                {...register("confirm_password")}
                type="password"
                className="mt-2 w-full h-12 rounded-lg bg-input-dark border border-border-dark px-4"
              />
              {errors.confirm_password && (
                <p className="text-red-500 text-xs">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm text-center">
                {errorMessage}
              </p>
            )}

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
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ResetPassword;