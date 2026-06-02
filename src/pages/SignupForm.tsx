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
import heroVisual from "../assets/hero/04-f11.jpg";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  full_name: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  "w-full bg-surface-low border border-[rgba(248,246,241,0.15)] px-4 py-3.5 rounded text-on-surface outline-none transition-colors focus:border-premium-gold placeholder:text-outline-variant";

export const SignupForm = () => {
  const { signup } = useAuth();
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
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await signup(data);
      toast.success("Welcome to Elycapvest!");
      navigate("/verify_email", {
        state: { email: data.email },
        replace: true,
      });
    } catch (err: unknown) {
      console.log(err);
      const error = err as {
        response?: { data?: { detail?: string; message?: string } };
        message?: string;
      };
      toast.error(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Something went wrong."
      );
    }
  };

  return (
    <main className="min-h-screen flex bg-primary-container text-on-surface overflow-hidden">
      <Toaster position="top-right" />

      {/* LEFT: Form */}
      <div className="w-full lg:w-1/2 flex flex-col z-10 px-8 md:px-16 py-12 bg-primary-container overflow-y-auto">
        <div className="mb-12">
          <Link to="/" className="font-display text-2xl font-semibold text-premium-gold tracking-tight">
            Elycapvest
          </Link>
        </div>

        {/* Form */}
        <div className="max-w-md w-full">
          <header className="mb-8">
            <h2 className="font-display text-4xl mb-3">Create your account</h2>
            <p className="text-lg text-on-surface-variant">Democratizing world-class real estate.</p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="label-caps text-on-surface-variant block">Full Name</label>
              <input {...register("full_name")} placeholder="Elias Vantelo" className={inputClass} />
              {errors.full_name && (
                <span className="text-error text-xs">{errors.full_name.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <label className="label-caps text-on-surface-variant block">Email Address</label>
              <input
                {...register("email")}
                type="email"
                placeholder="e.vantelo@private.com"
                className={inputClass}
              />
              {errors.email && <span className="text-error text-xs">{errors.email.message}</span>}
            </div>

            <div className="space-y-2">
              <label className="label-caps text-on-surface-variant block">Phone Number</label>
              <input
                {...register("phone")}
                type="tel"
                placeholder="+234 800 000 0000"
                className={inputClass}
              />
              {errors.phone && <span className="text-error text-xs">{errors.phone.message}</span>}
            </div>

            <div className="space-y-2">
              <label className="label-caps text-on-surface-variant block">Password</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-premium-gold"
                >
                  {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-error text-xs">{errors.password.message}</span>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gold w-full py-4 text-[12px] disabled:opacity-70"
              >
                {isSubmitting ? "Processing…" : "Create Account"}
              </button>
            </div>

            <p className="text-center text-on-surface-variant mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-premium-gold font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>

        <footer className="mt-auto pt-12 flex gap-6 border-t border-[rgba(248,246,241,0.1)]">
          <Link to="/contact" className="label-caps text-on-surface-variant hover:text-premium-gold transition-colors">
            Help Center
          </Link>
          <Link to="/about" className="label-caps text-on-surface-variant hover:text-premium-gold transition-colors">
            Privacy Policy
          </Link>
        </footer>
      </div>

      {/* RIGHT: Aspirational visual */}
      <div className="hidden lg:block lg:w-1/2 relative bg-surface-lowest overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-container to-transparent z-10 w-32" />
        <div className="absolute inset-0 bg-black/30 z-0" />
        <img
          src={heroVisual}
          alt="Featured property"
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
        />

        <div className="absolute bottom-16 left-12 right-12 glass-panel p-8 rounded-xl z-20">
          <span className="label-caps text-premium-gold mb-2 block">Featured Opportunity</span>
          <h3 className="font-display text-2xl text-on-surface mb-2">
            {featured?.title ?? "Premium Real Estate"}
          </h3>
          <p className="text-on-surface-variant max-w-sm mb-6">
            {featured?.location
              ? `Institutional-grade real estate in ${featured.location}.`
              : "Experience institutional-grade real estate investment."}
          </p>
          <div className="flex items-center gap-6">
            <div>
              <p className="label-caps text-[10px] text-on-surface-variant opacity-60 mb-1">Target Yield</p>
              <p className="data-stat text-success-emerald text-lg">
                {featured ? `${featured.expected_roi}% p.a.` : "—"}
              </p>
            </div>
            <div className="h-10 w-[1px] bg-[rgba(248,246,241,0.15)]" />
            <div>
              <p className="label-caps text-[10px] text-on-surface-variant opacity-60 mb-1">Per Fraction</p>
              <p className="data-stat text-on-surface text-lg">
                {featured?.fraction_price ? `₦${featured.fraction_price.toLocaleString()}` : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
