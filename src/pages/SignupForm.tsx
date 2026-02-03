import { useState, useEffect } from "react"; // Added for carousel logic
import {useNavigate, Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import auth_img from "../assets/auth.jpg";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  full_name: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

// Carousel Phrases
const phrases = [
  "Modern architectural designs for modern living.",
  "Secure and transparent property acquisition.",
  "Experience luxury within your reach.",
  "Tailored real estate solutions just for you."
];

export const SignupForm = () => {
  const { signup} = useAuth();
  const navigate = useNavigate();
  const [phraseIndex, setPhraseIndex] = useState(0);

  // Carousel Logic: Changes phrase every 4 seconds
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
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
          await signup(data);
      toast.success("Welcome to Elycapvest!");

 navigate("/verify_email", { 
      state: { email: data.email },
      replace: true // Prevents user from clicking 'back' to the signup form
    });
    } catch (err: any) {

console.log(err)
      toast.error(err.response?.data?.detail || "Something went wrong.");
    }
  };

  return (
    <section className="flex flex-col md:flex-row h-screen w-full bg-white">
      <Toaster position="top-right" />

      {/* LEFT SIDE: IMAGE & BRANDING */}
      <div className="md:w-1/2 h-64 md:h-full relative overflow-hidden">
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        
        <img 
          src={auth_img} 
          alt="Luxury Interior" 
          className="object-cover w-full h-full absolute inset-0" 
        />

        {/* Company Name (Top Left) */}
        <div className="absolute top-10 left-10 z-20">
          <Link to="/" className="text-white text-2xl font-black tracking-tighter uppercase">
            Elycap<span className="text-blue-400">vest</span>
          </Link>
        </div>

        {/* Carousel (Bottom Left) */}
        <div className="absolute bottom-12 left-10 right-10 z-20">
          <div className="h-[2px] w-12 bg-blue-400 mb-4"></div>
          <p className="text-white text-xl md:text-3xl font-light italic transition-opacity duration-1000 animate-pulse">
            "{phrases[phraseIndex]}"
          </p>
          <p className="text-gray-300 text-sm mt-2 uppercase tracking-widest">Why Choose Us</p>
        </div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md flex flex-col gap-5"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500">Join our community of luxury homeowners today.</p>
          </div>

          {/* Name Field */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 text-gray-700">Full Name</label>
            <input
              {...register("full_name")}
              placeholder="John Doe"
              className={`border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-900/20 ${errors.full_name ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors.full_name && <span className="text-red-500 text-xs mt-1">{errors.full_name.message}</span>}
          </div>

          {/* Email Field */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 text-gray-700">Email Address</label>
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className={`border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-900/20 ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
          </div>

          {/* Phone Field */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 text-gray-700">Phone Number</label>
            <input
              {...register("phone")}
              type="tel"
              placeholder="+234..."
              className={`border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-900/20 ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone.message}</span>}
          </div>

          {/* Password Field */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 text-gray-700">Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className={`border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-900/20 ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
          >
            {isSubmitting ? "Processing..." : "Sign Up"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already a member? <a href="/login" className="text-blue-900 font-bold">Login</a>
          </p>
        </form>
      </div>
    </section>
  );
};
