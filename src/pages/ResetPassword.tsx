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
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const newPasswordValue = watch("new_password") ?? "";
  const passwordStrength = (() => {
    const val = newPasswordValue;
    let s = 0;
    if (val.length > 0) s = 1;
    if (val.length >= 8) s = 2;
    if (val.length >= 10 && /[A-Z]/.test(val) && /[0-9]/.test(val)) s = 3;
    if (val.length >= 12 && /[^A-Za-z0-9]/.test(val)) s = 4;
    return s;
  })();
  const strengthLabels = ["None", "Weak", "Fair", "Strong", "Institutional"];
  const strengthColors = ["", "bg-error", "bg-tertiary", "bg-secondary", "bg-success-emerald"];

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
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-on-surface relative overflow-hidden px-8 py-12">
      <Toaster />
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-premium-gold opacity-[0.03] blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-success-emerald opacity-[0.03] blur-[120px]" />
      </div>

      <header className="mb-12 z-10 text-center">
        <h1 className="font-display text-4xl text-premium-gold tracking-tight mb-2">Elycapvest</h1>
        <p className="label-caps text-on-surface-variant opacity-70 tracking-widest">
          Institutional Asset Protection
        </p>
      </header>

      <div className="w-full max-w-[440px] z-10">
        <section className="glass-panel p-6 rounded-xl shadow-2xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span
                className="material-symbols-outlined text-premium-gold"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
              <h2 className="font-display text-2xl text-on-surface">Reset Password</h2>
            </div>
            <p className="text-on-surface-variant">Define a new secure password for your account access.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email (read-only) */}
            <div>
              <label className="block label-caps text-on-surface-variant mb-2">Account Email</label>
              <input
                {...register("email")}
                disabled
                value={email}
                className="w-full bg-surface-lowest border border-[rgba(248,246,241,0.15)] rounded py-3 px-4 text-on-surface-variant opacity-70"
              />
              {errors.email && <p className="text-error text-sm mt-1">{String(errors.email.message)}</p>}
            </div>

            {/* Reset code */}
            <div>
              <label className="block label-caps text-on-surface-variant mb-2">Reset Code</label>
              <input
                {...register("reset_code")}
                placeholder="6-digit code"
                className="w-full bg-surface-low border border-[rgba(248,246,241,0.15)] rounded py-3 px-4 text-on-surface outline-none focus:border-premium-gold focus:ring-1 focus:ring-premium-gold transition-all data-stat"
              />
              {errors.reset_code && (
                <p className="text-error text-sm mt-1">{String(errors.reset_code.message)}</p>
              )}
            </div>

            {/* New password + strength */}
            <div>
              <label className="block label-caps text-on-surface-variant mb-2">New Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("new_password")}
                  placeholder="••••••••••••"
                  className="w-full bg-surface-low border border-[rgba(248,246,241,0.15)] rounded py-3 pl-10 pr-12 text-on-surface outline-none focus:border-premium-gold focus:ring-1 focus:ring-premium-gold transition-all placeholder:text-on-surface-variant/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-premium-gold transition-colors"
                >
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
              {/* Strength visualizer */}
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="label-caps text-[10px] text-on-surface-variant">Security Strength</span>
                  <span className="data-stat text-[10px] text-on-surface-variant">
                    {strengthLabels[passwordStrength]}
                  </span>
                </div>
                <div className="h-1 w-full rounded-full flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-full w-1/4 rounded-full transition-all duration-300 ${
                        i < passwordStrength ? strengthColors[passwordStrength] : "bg-surface-highest"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {errors.new_password && (
                <p className="text-error text-sm mt-1">{String(errors.new_password.message)}</p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block label-caps text-on-surface-variant mb-2">Confirm Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  shield
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirm_password")}
                  placeholder="••••••••••••"
                  className="w-full bg-surface-low border border-[rgba(248,246,241,0.15)] rounded py-3 pl-10 pr-12 text-on-surface outline-none focus:border-premium-gold focus:ring-1 focus:ring-premium-gold transition-all placeholder:text-on-surface-variant/30"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-premium-gold transition-colors"
                >
                  {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-error text-sm mt-1">{String(errors.confirm_password.message)}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold w-full py-4 text-[12px] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? "Resetting…" : "Update Credentials"}
              <span className="material-symbols-outlined text-[18px]">key</span>
            </button>

            <p
              className="text-center label-caps text-on-surface-variant cursor-pointer hover:text-premium-gold transition-colors inline-flex items-center justify-center gap-2 w-full"
              onClick={() => navigate("/login")}
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to Secure Login
            </p>
          </form>
        </section>
      </div>
    </main>
  );
};

export default ResetPassword;
