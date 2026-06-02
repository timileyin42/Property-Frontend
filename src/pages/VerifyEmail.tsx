import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCooldown } from "../hooks/useCooldown";

export const VerifyEmail = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const email: string | undefined = location.state?.email;
  const isComplete = otp.every(Boolean);

  const { verifyEmail, resendOtp } = useAuth();

  // 🚫 Prevent direct access without email
  useEffect(() => {
    if (!email) {
      navigate("/signup", { replace: true });
    }
  }, [email, navigate]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value.slice(-1);
    setOtp(newOtp);

    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData("text").slice(0, 6).split("");
    if (data.length === 6) {
      setOtp(data);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    // ✅ Type guard (fixes TS2322)
    if (!email) {
      toast.error("Email missing. Please sign up again.");
      navigate("/signup", { replace: true });
      return;
    }

    try {
      const res = await verifyEmail({ email, code }); // ✅ no unused variable
      toast.success("Email verified successfully!");
      if (!res?.access_token) {
        toast.success("Email verified. Please log in to continue.");
        navigate("/login", { replace: true });
        return;
      }
      navigate("/profile", { replace: true });
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { detail?: string; message?: string } };
        message?: string;
      };
      toast.error(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          "Invalid or expired code"
      );
    }
  };

  // 🔁 Resend OTP
  const cooldownKey = email ? `otp-resend-${email}` : "otp-resend-unknown";
  const { remaining, start, isActive } = useCooldown(cooldownKey, 60);

  const handleResend = async () => {
    if (isActive) return;

    // ✅ Type guard
    if (!email) {
      toast.error("Email not found. Please sign up again.");
      navigate("/signup", { replace: true });
      return;
    }

    try {
      await resendOtp({email});
      toast.success("Verification code resent");
      start();
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { detail?: string; message?: string } };
        message?: string;
      };
      toast.error(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          "Failed to resend code"
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary-container text-on-surface p-4 relative overflow-hidden">
      <Toaster />
      {/* ambient glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-premium-gold opacity-[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-success-emerald opacity-[0.04] blur-[120px] pointer-events-none" />

      <header className="mb-10 z-10 text-center">
        <h1 className="font-display text-3xl text-premium-gold tracking-tight">Elycapvest</h1>
        <p className="label-caps text-[10px] text-on-surface-variant opacity-70 mt-1">
          Institutional Asset Protection
        </p>
      </header>

      <div className="max-w-md w-full glass-panel p-8 rounded-xl text-center z-10">
        <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-full border border-premium-gold/40 bg-premium-gold/10 text-premium-gold">
          <span className="material-symbols-outlined text-3xl">mail</span>
        </div>
        <h2 className="font-display text-2xl text-on-surface mb-2">Verify your email</h2>
        <p className="text-on-surface-variant">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-premium-gold">{email}</span>
        </p>

        <div className="flex justify-center gap-2 my-8" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-center text-2xl data-stat bg-surface-lowest border border-[rgba(248,246,241,0.15)] rounded-lg text-on-surface focus:border-premium-gold focus:ring-1 focus:ring-premium-gold outline-none transition-all"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isComplete}
          className="btn-gold w-full py-3.5 text-[12px] disabled:opacity-50"
        >
          Verify Account
        </button>

        <p className="mt-6 text-sm text-on-surface-variant">
          Didn&apos;t receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={isActive}
            className={`font-bold ${
              isActive
                ? "text-outline cursor-not-allowed"
                : "text-premium-gold hover:underline"
            }`}
          >
            {isActive ? `Resend in ${remaining}s` : "Resend"}
          </button>
        </p>
      </div>
    </div>
  );
};
