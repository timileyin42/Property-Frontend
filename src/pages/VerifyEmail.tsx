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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Toaster />

      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Verify your email
        </h2>

        <p className="text-gray-500 mt-2">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-blue-900">
            {email}
          </span>
        </p>

        <div
          className="flex justify-center gap-2 my-8"
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg bg-gray-50 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isComplete}
          className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-black transition-all disabled:opacity-50"
        >
          Verify Account
        </button>

        <p className="mt-6 text-sm text-gray-500">
          Didn&apos;t receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={isActive}
            className={`font-bold ${
              isActive
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-900 hover:underline"
            }`}
          >
            {isActive ? `Resend in ${remaining}s` : "Resend"}
          </button>
        </p>
      </div>
    </div>
  );
};
