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
  } catch (err: any) {
    console.log(err);
    toast.error(
      err?.data?.detail || "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex  flex-col items-center justify-center bg-gray-50 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Toaster />
          <div className="bg-blue-900 text-white p-2 rounded-md">
            
          </div>
          <h1 className="text-xl font-bold text-blue-900">
            Elycapvest
          </h1>
        </div>
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        {/* Logo */}
        

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
          Forgot password?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          No worries! Enter your email and we’ll send you reset instructions.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative mt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={email}
                className="w-full text-gray-900 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-2 rounded-lg font-medium hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to login */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-blue-900 inline-flex items-center gap-1"
          >
            ← Back to login
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Need help?{" "}
          <span className="text-blue-900 hover:underline cursor-pointer">
            Contact Support
          </span>{" "}
          |{" "}
          <span className="text-blue-900 hover:underline cursor-pointer">
            FAQs
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
