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
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.detail || error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------- UI ---------------------------------------- */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Toaster />

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
          Reset your password
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Create a strong, unique password for your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Reset code"
            value={form.reset_code}
            onChange={(e) =>
              handleChange("reset_code", e.target.value)
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-900"
          />

          <input
            type="password"
            placeholder="New password"
            value={form.new_password}
            onChange={(e) =>
              handleChange("new_password", e.target.value)
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-900"
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={form.confirm_password}
            onChange={(e) =>
              handleChange("confirm_password", e.target.value)
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-900"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-2 rounded-lg font-medium hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-blue-900"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
