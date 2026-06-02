import { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactFormValues } from "../validators/contact.schema";
import { api } from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { InterestSuccessData } from "../types/interest";
import { ApiProperty } from "../types/property";

interface InterestFormProps {
  property: ApiProperty;
}

interface ContactResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  property_id: number;
  status: string;
  contacted_at: string;
  assigned_admin_id: number;
  notes: string;
  created_at: string;
  updated_at: string;
  property_title: string;
  assigned_admin_name: string;
}

const TIMELINES = [
  "Immediate (Within 7 Days)",
  "Short Term (14-30 Days)",
  "Strategic (30+ Days)",
];

const CONTACT_METHODS = [
  { key: "Email", icon: "mail" },
  { key: "Phone Call", icon: "phone_in_talk" },
  { key: "Video Brief", icon: "video_call" },
];

const InterestForm: React.FC<InterestFormProps> = ({ property }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const idempotencyKeyRef = useRef<string>(uuidv4());

  // Design-driven inputs, folded into the `message` payload on submit
  const [targetAmount, setTargetAmount] = useState("");
  const [timeline, setTimeline] = useState(TIMELINES[0]);
  const [contactPref, setContactPref] = useState("Phone Call");
  const [notes, setNotes] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: isAuthenticated ? user?.full_name ?? "" : "",
      email: isAuthenticated ? user?.email ?? "" : "",
      phone: isAuthenticated ? user?.phone ?? "" : "",
      message: "",
      property_id: property.id,
    },
  });

  // Compose the message from the design fields so the backend captures everything
  useEffect(() => {
    const composed =
      `Expression of interest in ${property.title}. ` +
      `Target investment: ${targetAmount ? `₦${targetAmount}` : "Not specified"}. ` +
      `Capital deployment timeline: ${timeline}. ` +
      `Preferred contact: ${contactPref}.` +
      (notes.trim() ? ` Notes: ${notes.trim()}` : "");
    setValue("message", composed, { shouldValidate: true });
  }, [targetAmount, timeline, contactPref, notes, property.title, setValue]);

  const onSubmit = async (data: ContactFormValues) => {
    if (isSubmitting) return;
    try {
      if (isAuthenticated) {
        const res = await api.post("/user/interests", data);
        const successPayload: InterestSuccessData = { property, email: data.email };
        toast.success(res.data.message);
        navigate("/interest-success", { replace: true, state: successPayload });
      } else {
        const res = await api.post<ContactResponse>("/contact", {
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          property_id: data.property_id,
        });
        idempotencyKeyRef.current = uuidv4();
        toast.success(res.data.message);
        reset();
        setTargetAmount("");
        setNotes("");
      }
    } catch (err: unknown) {
      idempotencyKeyRef.current = uuidv4();
      const error = err as {
        response?: { data?: { detail?: string; message?: string } };
        message?: string;
      };
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          error.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  const inputGlass =
    "w-full px-4 py-3 bg-white/[0.03] border border-[rgba(248,246,241,0.1)] text-on-surface rounded outline-none transition-all focus:border-premium-gold focus:bg-white/[0.07] placeholder:text-on-surface-variant/40";
  const lockedGlass =
    "w-full px-4 py-3 bg-surface-lowest border border-[rgba(248,246,241,0.1)] text-on-surface-variant rounded opacity-80";

  return (
    <div className="glass-panel p-6 md:p-glass-padding rounded-lg shadow-2xl relative overflow-hidden">
      <Toaster />
      <div className="absolute top-0 right-0 w-64 h-64 bg-premium-gold/5 blur-[120px] rounded-full -mr-32 -mt-32 pointer-events-none" />

      <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-10">
        {/* Contact identity */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-premium-gold">badge</span>
            <h2 className="font-display text-2xl text-on-surface">Your Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="label-caps text-on-surface-variant">Full Name</label>
              <input
                {...register("name")}
                disabled={isAuthenticated}
                placeholder="Full name"
                className={isAuthenticated ? lockedGlass : inputGlass}
              />
              {errors.name && <p className="text-error text-sm">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="label-caps text-on-surface-variant">Phone</label>
              <input
                {...register("phone")}
                disabled={isAuthenticated}
                placeholder="+234…"
                className={isAuthenticated ? lockedGlass : inputGlass}
              />
              {errors.phone && <p className="text-error text-sm">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="label-caps text-on-surface-variant">Email</label>
              <input
                {...register("email")}
                disabled={isAuthenticated}
                placeholder="you@email.com"
                className={isAuthenticated ? lockedGlass : inputGlass}
              />
              {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}
            </div>
          </div>
        </div>

        {/* Investment Intent */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-premium-gold">payments</span>
            <h2 className="font-display text-2xl text-on-surface">Investment Intent</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="label-caps text-on-surface-variant">Target Investment Amount (₦)</label>
              <input
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="e.g. 250,000"
                className={`${inputGlass} data-stat`}
              />
            </div>
            <div className="space-y-2">
              <label className="label-caps text-on-surface-variant">Capital Deployment Timeline</label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className={`${inputGlass} appearance-none`}
              >
                {TIMELINES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-premium-gold">contact_support</span>
            <h2 className="font-display text-2xl text-on-surface">Communication Preferences</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {CONTACT_METHODS.map((m) => {
              const active = contactPref === m.key;
              return (
                <button
                  type="button"
                  key={m.key}
                  onClick={() => setContactPref(m.key)}
                  className={`flex-1 min-w-[140px] p-4 border rounded text-center transition-all ${
                    active
                      ? "border-premium-gold bg-premium-gold/10 text-premium-gold"
                      : "border-[rgba(248,246,241,0.15)] text-on-surface-variant hover:border-premium-gold"
                  }`}
                >
                  <span className="material-symbols-outlined block mb-2">{m.icon}</span>
                  <span className="label-caps">{m.key}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-premium-gold">chat_bubble</span>
            <h2 className="font-display text-2xl text-on-surface">Message for Asset Manager</h2>
          </div>
          <div className="space-y-2">
            <label className="label-caps text-on-surface-variant">Notes or Specific Requirements</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Briefly describe your investment objectives or any specific questions…"
              className={`${inputGlass} resize-none`}
            />
            {errors.message && <p className="text-error text-sm">{errors.message.message}</p>}
          </div>
        </div>

        {/* Guest notice */}
        {!isAuthenticated && (
          <div className="glass-panel p-4 rounded text-sm text-on-surface-variant">
            <strong className="text-premium-gold">Note:</strong> You are not logged in. You can
            still submit, but you won&apos;t be able to track it.{" "}
            <a href="/login" className="text-premium-gold hover:underline">Log in</a> or{" "}
            <a href="/signup" className="text-premium-gold hover:underline">Sign up</a> for full access.
          </div>
        )}

        {/* CTA */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-[rgba(248,246,241,0.15)]">
          <p className="text-on-surface-variant text-sm max-w-sm italic opacity-60">
            By submitting, you acknowledge that this is a non-binding expression of interest and
            subject to standard verification.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-gold w-full md:w-auto px-12 py-4 text-[12px] disabled:opacity-50"
          >
            {isSubmitting ? "Submitting…" : "Submit Interest"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InterestForm;
