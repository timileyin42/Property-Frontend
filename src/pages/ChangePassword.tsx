import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";

/* -------------------------------------------------------------------------- */
/*                               ZOD SCHEMA                                   */
/* -------------------------------------------------------------------------- */

const resetPasswordSchema = z
  .object({
    reset_code: z
      .string()
      .length(6, "Reset code must be 6 digits"),

    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number")
      .regex(
        /[@$!%*?&#]/,
        "Must contain a special character (@$!%*?&#)"
      ),

    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

/* -------------------------------------------------------------------------- */
/*                               COMPONENT                                    */
/* -------------------------------------------------------------------------- */

const ChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmResetPassword } = useAuth();

  // Email passed from Forgot Password
  const email: string = location.state?.email;
  console.log("email");
  console.log(email);
  console.log(email);
  console.log("email");

  const [form, setForm] = useState<ResetPasswordForm>({
    reset_code: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  /* ---------------------------- SAFE REDIRECT ----------------------------- */
  useEffect(() => {
    if (!email) {
      navigate("/forgotpassword", { replace: true });
    } else {
      setIsReady(true);
    }
  }, [email, navigate]);

  if (!isReady) return null;

  /* ---------------------------- HANDLERS ---------------------------------- */

  const handleChange = (
    field: keyof ResetPasswordForm,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = resetPasswordSchema.safeParse(form);

    if (!parsed.success) {
      // ✅ SAFE ZOD ERROR ACCESS
      const message =
        parsed.error.issues?.[0]?.message ?? "Invalid input";
      toast.error(message);
      return;
    }

    try {
      setLoading(true);

      const data = await confirmResetPassword({
        email,
        reset_code: parsed.data.reset_code,
        new_password: parsed.data.new_password,
      });

      toast.success(data.message || "Password reset successful");
      navigate("/login", { replace: true });
    } catch (error: unknown) {
      console.log(error);
      const err = error as {
        response?: { data?: { detail?: string; message?: string } };
        message?: string;
      };
      toast.error(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------- UI ---------------------------------------- */

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
              <h2 className="font-display text-2xl text-on-surface">Reset your password</h2>
            </div>
            <p className="text-on-surface-variant">Create a strong, unique password for your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block label-caps text-on-surface-variant mb-2">Reset Code</label>
              <input
                type="text"
                placeholder="6-digit code"
                value={form.reset_code}
                onChange={(e) => handleChange("reset_code", e.target.value)}
                className="w-full bg-surface-low border border-[rgba(248,246,241,0.15)] rounded py-3 px-4 text-on-surface outline-none focus:border-premium-gold focus:ring-1 focus:ring-premium-gold transition-all data-stat placeholder:text-on-surface-variant/30"
              />
            </div>
            <div>
              <label className="block label-caps text-on-surface-variant mb-2">New Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  lock
                </span>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={form.new_password}
                  onChange={(e) => handleChange("new_password", e.target.value)}
                  className="w-full bg-surface-low border border-[rgba(248,246,241,0.15)] rounded py-3 pl-10 pr-4 text-on-surface outline-none focus:border-premium-gold focus:ring-1 focus:ring-premium-gold transition-all placeholder:text-on-surface-variant/30"
                />
              </div>
            </div>
            <div>
              <label className="block label-caps text-on-surface-variant mb-2">Confirm New Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  shield
                </span>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={form.confirm_password}
                  onChange={(e) => handleChange("confirm_password", e.target.value)}
                  className="w-full bg-surface-low border border-[rgba(248,246,241,0.15)] rounded py-3 pl-10 pr-4 text-on-surface outline-none focus:border-premium-gold focus:ring-1 focus:ring-premium-gold transition-all placeholder:text-on-surface-variant/30"
                />
              </div>
            </div>

            <div className="glass-panel p-4 rounded text-sm text-on-surface-variant">
              <p className="label-caps text-[10px] text-on-surface mb-2">Password must contain</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>At least 8 characters</li>
                <li>Uppercase, lowercase, number, and special character</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 text-[12px] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Resetting…" : "Update Credentials"}
              <span className="material-symbols-outlined text-[18px]">key</span>
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-on-surface-variant hover:text-premium-gold label-caps transition-colors inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Back to Secure Login
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default ChangePassword;
