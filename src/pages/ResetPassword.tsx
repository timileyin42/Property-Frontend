import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation} from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { HiEye, HiEyeOff } from "react-icons/hi"; // Using HeroIcons from react-icons
import { useAuth } from "../context/AuthContext";
import {
  resetPasswordSchema,
  ResetPasswordValues,
} from "../types/resetPassword.schema";
// import { Link, useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const email: string = location.state?.email;
  console.log(email)

  // Visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const email = searchParams.get("email");
    const code = searchParams.get("code");
    if (email) setValue("email", email);
    if (code) setValue("reset_code", code);
  }, [searchParams, setValue]);

  const onSubmit = async (data: ResetPasswordValues) => {
    try {
      await resetPassword({
        email: data.email,
        reset_code: data.reset_code,
        new_password: data.new_password,
      });
      toast.success("Password reset successful. Please log in.");
      navigate("/login");
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { detail?: string; message?: string } };
        message?: string;
      };
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          error.message ||
          "Failed to reset password"
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="flex items-center gap-2 mb-6">
        <Toaster />
        <h1 className="text-xl font-bold text-blue-900">Elycapvest</h1>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-2">Reset password</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Create a strong, unique password for your account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email (Read Only) */}
          <input
            {...register("email")}
            disabled
            placeholder={email}
            value={email}
            className="w-full p-3 border rounded-lg bg-gray-100"
          />
         {errors.email && (
  <p className="text-red-500 text-sm">
    {String(errors.email.message)}
  </p>
)}

          {/* Reset Code */}
          <input
            {...register("reset_code")}
            placeholder="Reset code"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
          />
          {errors.reset_code && (
            <p className="text-red-500 text-sm">
             {String(errors.reset_code.message)}
              </p>
            )}

          {/* New Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("new_password")}
              placeholder="New password"
              className="w-full p-3 border rounded-lg pr-12 focus:ring-2 focus:ring-blue-900 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-900 transition-colors"
            >
              {showPassword ? <HiEyeOff size={22} /> : <HiEye size={22} />}
            </button>
          </div>
         {errors.new_password && (
  <p className="text-red-500 text-sm">
    {String(errors.new_password.message)}
  </p>
)}


          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirm_password")}
              placeholder="Confirm new password"
              className="w-full p-3 border rounded-lg pr-12 focus:ring-2 focus:ring-blue-900 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-900 transition-colors"
            >
              {showConfirmPassword ? <HiEyeOff size={22} /> : <HiEye size={22} />}
            </button>
          </div>
          {errors.confirm_password && (
          <p className="text-red-500 text-sm">
            {String(errors.confirm_password.message)}
            </p>
)           }

          <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-700">
            <p className="font-semibold mb-1">Password must contain:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>At least 8 characters</li>
              <li>Uppercase, lowercase, number, and special character</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-black transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>

          <p
            className="text-center text-sm text-gray-500 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            ← Back to login
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
