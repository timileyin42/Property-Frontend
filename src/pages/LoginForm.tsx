import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { fetchFeaturedProperties } from "../api/properties";
import type { ApiProperty } from "../types/property";
import heroVisual from "../assets/hero/01-aerial-night.jpg";

const loginSchema = z.object({
  username: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginValues = z.infer<typeof loginSchema>;

const inputClass =
  "w-full bg-surface-lowest border border-[rgba(248,246,241,0.15)] rounded px-4 py-3 text-on-surface outline-none transition-all focus:border-premium-gold focus:ring-1 focus:ring-premium-gold placeholder:text-outline-variant";

export const LoginForm = () => {
  const { user, loading, signin } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [featured, setFeatured] = useState<ApiProperty | null>(null);

  useEffect(() => {
    fetchFeaturedProperties(1)
      .then((data) => setFeatured(data?.[0] ?? null))
      .catch((err) => console.error(err));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: localStorage.getItem("remembered_email") ?? "",
      password: localStorage.getItem("remembered_password") ?? "",
      rememberMe: !!localStorage.getItem("remembered_email"),
    },
  });

  useEffect(() => {
    if (loading || !user) return;
    navigate("/", { replace: true });
  }, [user, loading, navigate]);

  const onSubmit = async (data: LoginValues) => {
    try {
      if (data.rememberMe) {
        localStorage.setItem("remembered_email", data.username);
        localStorage.setItem("remembered_password", data.password);
      } else {
        localStorage.removeItem("remembered_email");
        localStorage.removeItem("remembered_password");
      }

      await signin({
        username: data.username,
        password: data.password,
        rememberMe: data.rememberMe,
      });
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { detail?: string; message?: string } };
        message?: string;
      };
      toast.error(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Invalid credentials"
      );
    }
  };

  const fundingPct =
    featured && featured.total_fractions > 0
      ? Math.round(((featured.fractions_sold ?? 0) / featured.total_fractions) * 100)
      : 0;

  return (
    <main className="min-h-screen w-full flex bg-primary-container text-on-surface overflow-hidden">
      <Toaster position="top-right" />

      {/* LEFT: Login form */}
      <section className="w-full lg:w-5/12 xl:w-4/12 flex flex-col justify-center items-center px-8 md:px-16 py-12 relative bg-primary-container">
        <div className="w-full max-w-md space-y-10">
          <div className="flex flex-col items-start gap-2">
            <Link to="/" className="font-display text-2xl font-semibold text-premium-gold tracking-tight">
              Elycapvest
            </Link>
            <h1 className="font-display text-4xl text-on-surface mt-4">Welcome Back.</h1>
            <p className="text-on-surface-variant">
              Institutional fractional ownership of premium real estate.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="label-caps text-on-surface-variant block">Email Address</label>
              <input
                {...register("username")}
                type="email"
                placeholder="investor@elycapvest.com"
                className={inputClass}
              />
              {errors.username && (
                <span className="text-error text-xs">{errors.username.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="label-caps text-on-surface-variant block">Password</label>
                <Link
                  to="/forgotpassword"
                  className="label-caps text-[10px] text-premium-gold hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-premium-gold"
                >
                  {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-error text-xs">{errors.password.message}</span>
              )}
            </div>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="appearance-none w-5 h-5 border border-[rgba(248,246,241,0.3)] rounded checked:bg-premium-gold checked:border-premium-gold transition-all"
              />
              <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                Remember me
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold w-full py-4 text-[12px] disabled:opacity-70"
            >
              {isSubmitting ? "Authenticating…" : "Sign In"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-on-surface-variant">
              Don't have an account?{" "}
              <Link to="/signup" className="text-premium-gold font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 label-caps text-[10px] text-outline-variant tracking-widest text-center px-4">
          © {new Date().getFullYear()} Elycapvest Luxury Homes. All fractional investments are subject to regulatory approval.
        </div>
      </section>

      {/* RIGHT: Property visual + live stats */}
      <section className="hidden lg:flex w-7/12 xl:w-8/12 relative overflow-hidden bg-surface-lowest">
        <img
          src={heroVisual}
          alt="Featured property"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.6]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

        {featured && (
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end gap-6">
            <div className="glass-panel p-6 rounded-xl max-w-lg space-y-4">
              <span className="label-caps text-premium-gold block">Active Listing</span>
              <h2 className="font-display text-3xl text-white leading-tight">
                {featured.title}
              </h2>
              <div className="grid grid-cols-3 gap-6 py-4 border-y border-[rgba(248,246,241,0.15)]">
                <div className="space-y-1">
                  <span className="label-caps text-[10px] text-on-surface-variant">Expected ROI</span>
                  <div className="data-stat text-success-emerald text-lg">{featured.expected_roi}%</div>
                </div>
                <div className="space-y-1">
                  <span className="label-caps text-[10px] text-on-surface-variant">Valuation</span>
                  <div className="data-stat text-white text-lg">
                    {featured.project_value
                      ? `₦${(featured.project_value / 1_000_000).toFixed(1)}M`
                      : "—"}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="label-caps text-[10px] text-on-surface-variant">Per Fraction</span>
                  <div className="data-stat text-white text-lg">
                    {featured.fraction_price ? `₦${featured.fraction_price.toLocaleString()}` : "—"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <span className="material-symbols-outlined text-premium-gold">location_on</span>
                <span>{featured.location}</span>
              </div>
            </div>

            <div className="hidden xl:flex">
              <div className="glass-panel px-6 py-4 rounded-full flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-success-emerald animate-pulse" />
                <span className="label-caps text-[11px] text-white tracking-widest">
                  Funding {fundingPct}% Complete
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-8 right-8">
          <div className="w-16 h-16 border border-[rgba(248,246,241,0.15)] rounded-full flex items-center justify-center glass-panel">
            <span className="font-display text-2xl text-premium-gold italic">E</span>
          </div>
        </div>
      </section>
    </main>
  );
};
