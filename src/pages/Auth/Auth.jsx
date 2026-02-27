import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../store/auth/authThunks";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";


const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone_number: z
      .string()
      .regex(/^(\+91)?[6-9]\d{9}$/, "Enter valid Indian phone number"),
    password: z
      .string()
      .min(8, "Minimum 8 characters")
      .regex(/[A-Z]/, "Must contain uppercase")
      .regex(/[a-z]/, "Must contain lowercase")
      .regex(/[0-9]/, "Must contain number"),
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


function LoginRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });


const onSubmit = async (data) => {
  try {
    if (isLogin) {
      await dispatch(loginUser(data)).unwrap();
      navigate("/");
    } else {
      const { confirm_password, ...registerData } = data;

      const response = await dispatch(registerUser(registerData)).unwrap();

      localStorage.setItem("otp_phone", registerData.phone_number);

      navigate("/verify-otp");
    }
  } catch (err) {
    console.error("Auth Error:", err);
  }
};

  return (
    <div className="dark bg-background-dark min-h-screen flex flex-col text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[440px] bg-card-dark border border-border-dark rounded-xl p-8 shadow-2xl">

          <div className="text-center mb-8">
            <h1 className="text-[28px] font-bold tracking-tight">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
          </div>

          {/* Toggle */}
          <div className="flex mb-8">
            <div className="flex h-11 flex-1 rounded-lg bg-input-dark border border-border-dark p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 rounded-md ${
                  isLogin ? "bg-background-dark" : "text-gray-500"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 rounded-md ${
                  !isLogin ? "bg-background-dark" : "text-gray-500"
                }`}
              >
                Register
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {!isLogin && (
              <>
                <div>
                  <label>Full Name</label>
                  <input
                    {...register("name")}
                    className="mt-2 w-full h-12 rounded-lg bg-input-dark border border-border-dark px-4"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label>Phone Number</label>
                  <input
                    {...register("phone_number")}
                    className="mt-2 w-full h-12 rounded-lg bg-input-dark border border-border-dark px-4"
                  />
                  {errors.phone_number && (
                    <p className="text-red-500 text-xs">
                      {errors.phone_number.message}
                    </p>
                  )}
                </div>
              </>
            )}

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

            <div>
              <label>Password</label>
              <input
                {...register("password")}
                type="password"
                className="mt-2 w-full h-12 rounded-lg bg-input-dark border border-border-dark px-4"
              />
              {isLogin && (
                <div className="flex justify-end mt-2">
                  <span
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs text-primary cursor-pointer hover:underline"
                  >
                    Forgot Password?
                  </span>
                </div>
              )}
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            {!isLogin && (
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
            )}

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg bg-primary text-background-dark font-bold text-sm hover:bg-gray-200 disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : isLogin
                ? "Sign In"
                : "Register"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-white font-medium cursor-pointer"
            >
              {isLogin ? "Create an account" : "Login"}
            </span>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LoginRegister;
