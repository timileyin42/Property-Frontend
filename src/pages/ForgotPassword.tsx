import { useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext"


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email) {
    toast.error("Please enter your email address");
    return;
  }

  try {
    setLoading(true);

    const data = await forgotPassword({email});
    console.log(data);
    toast.success(data.message || "Reset code sent");

    navigate("/changepassword", {
      state: { email },
      replace: true,
    });
  } catch (err: unknown) {
    console.log(err);
    const error = err as {
      response?: { data?: { detail?: string; message?: string } };
      data?: { detail?: string; message?: string };
      message?: string;
    };
    toast.error(
      error.response?.data?.detail ||
        error.response?.data?.message ||
        error.data?.detail ||
        error.data?.message ||
        error.message ||
        "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-on-surface relative overflow-hidden px-8 py-12">
      <Toaster />
      {/* Ambient background effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-premium-gold opacity-[0.03] blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-success-emerald opacity-[0.03] blur-[120px]" />
      </div>

      {/* Branding anchor */}
      <header className="mb-12 z-10 text-center">
        <h1 className="font-display text-4xl text-premium-gold tracking-tight mb-2">Elycapvest</h1>
        <p className="label-caps text-on-surface-variant opacity-70 tracking-widest">
          Institutional Asset Protection
        </p>
      </header>

      <div className="w-full max-w-[440px] z-10 relative">
        <section className="glass-panel p-6 rounded-xl shadow-2xl">
          <div className="mb-8">
            <h2 className="font-display text-2xl text-on-surface mb-2">Forgot Password</h2>
            <p className="text-on-surface-variant">
              Enter the email associated with your account and we&apos;ll send recovery instructions.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block label-caps text-on-surface-variant mb-2">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full bg-surface-low border border-[rgba(248,246,241,0.15)] rounded py-3 pl-10 pr-4 text-on-surface outline-none focus:border-premium-gold focus:ring-1 focus:ring-premium-gold transition-all placeholder:text-on-surface-variant/30"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 text-[12px] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send Recovery Link"}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
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

      {/* Security footer */}
      <footer className="mt-12 max-w-[500px] text-center z-10">
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-on-surface-variant/40 text-[20px]">encrypted</span>
            <span className="label-caps text-[9px] text-on-surface-variant/40">256-Bit SSL</span>
          </div>
          <div className="w-px h-4 bg-[rgba(248,246,241,0.15)]" />
          <div className="flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-on-surface-variant/40 text-[20px]">account_balance</span>
            <span className="label-caps text-[9px] text-on-surface-variant/40">Secure Escrow</span>
          </div>
          <div className="w-px h-4 bg-[rgba(248,246,241,0.15)]" />
          <div className="flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-on-surface-variant/40 text-[20px]">authenticator</span>
            <span className="label-caps text-[9px] text-on-surface-variant/40">MFA Ready</span>
          </div>
        </div>
        <p className="text-[13px] text-on-surface-variant/60">
          Elycapvest security protocols ensure your recovery request is handled with institutional-grade privacy.{" "}
          <span className="text-premium-gold underline underline-offset-4 decoration-premium-gold/30 cursor-pointer">
            Privacy Policy
          </span>.
        </p>
      </footer>

      <div className="mt-auto pt-8 label-caps text-[10px] text-on-surface-variant/40 z-10">
        © {new Date().getFullYear()} Elycapvest Luxury Homes.
      </div>
    </main>
  );
};

export default ForgotPassword;
