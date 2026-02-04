import { useState, useEffect } from "react";
import { useNavigate, Link  } from "react-router-dom";
// useLocation
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import auth_img from "../assets/auth.jpg";


// type Role = "ADMIN" | "INVESTOR" | "USER";


const loginSchema = z.object({
  username: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginValues = z.infer<typeof loginSchema>;
console.log("signin page mounted");

const phrases = [
  "Welcome back to your luxury portfolio.",
  "Secure access to your property investments.",
  "Manage your real estate assets with ease.",
  "Real-time updates on your luxury acquisitions."
];

export const LoginForm = () => {
  const {user, loading} = useAuth()
  const { signin } = useAuth();
  const navigate = useNavigate();
  // const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  // ADMIN MISTAKENLY LOGGED ON THE REGULAR USER URL
  const adminUrl = import.meta.env.VITE_ADMIN_URL;
  console.log(adminUrl);

// const defaultDash = user?.role === "ADMIN" ? "/admindashboard" : "/investor/dashboard";
// const defaultDash = (() => {
//   if (!user?.role) return "/login";

//   return user.role === "ADMIN"
//     ? "/admindashboard"
//     : "/investor/dashboard";
// })();

// const from = location.state?.from?.pathname || defaultDash;

// animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 4000);
    return () => clearInterval(interval);
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
    }
  });

useEffect(() => {
    if (loading || !user) return;

    const redirectTo = "/";

    navigate(redirectTo, { replace: true });
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

      // toast.success("Welcome back!");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail ||
          err?.message ||
          "Invalid credentials"
      );
    }
  };



  return (
    <section className="flex flex-col md:flex-row h-screen w-full bg-white">
      <Toaster />
      {/* LEFT SIDE (Same as Signup) */}
      <div className="md:w-1/2 h-64 md:h-full relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img src={auth_img} alt="Luxury Home" className="object-cover w-full h-full absolute inset-0" />
        <div className="absolute top-10 left-10 z-20">
          <Link to="/" className="text-white text-2xl font-black tracking-tighter uppercase">
            Elycap<span className="text-blue-400">vest</span>

          </Link>
        </div>
        <div className="absolute bottom-12 left-10 right-10 z-20 text-white">
          <p className="text-xl md:text-3xl font-light italic">"{phrases[phraseIndex]}"</p>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500">Enter your credentials to access your account.</p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1 text-gray-700">Email Address</label>
              <input
                {...register("username")}
                type="email"
                placeholder="you@example.com"
                className={`border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-900/20 ${errors.username ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.username && <span className="text-red-500 text-xs mt-1">{errors.username.message}</span>}
            </div>

            {/* Password Field with Eye Toggle */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-gray-700">Password</label>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-900/20 ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-900"
                >
                  {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
                </button>
              </div>
              {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-blue-900 checked:border-blue-900 transition-all"
                  />
                  {/* Custom Checkmark Icon */}
                  <svg className="absolute w-3 h-3 text-white hidden peer-checked:block left-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
              </label>
              
              <Link to="/forgotpassword"  className="text-sm text-blue-900 font-bold hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isSubmitting ? "Authenticating..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-600">
            New to Elycapvest? <Link to="/signup" className="text-blue-900 font-bold">Create Account</Link>
          </p>
        </form>
      </div>
    </section>
  );
};