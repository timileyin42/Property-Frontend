import { Navigate, useLocation, Link } from "react-router-dom";
import type { InterestSuccessData } from "../types/interest";
import type { FC } from "react";

const InterestSuccess: FC = () => {
  const location = useLocation();
  const state = location.state as InterestSuccessData | null;

  if (
    !state ||
    !state.property ||
    typeof state.property.title !== "string" ||
    typeof state.email !== "string"
  ) {
    return <Navigate to="/properties" replace />;
  }

  const { property, email } = state;

  return (
    <main className="min-h-screen flex flex-col items-center bg-background text-on-surface relative overflow-hidden px-4 sm:px-8 py-16">
      {/* Ambient backdrop */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-primary-container/40 to-background" />

      <div className="max-w-5xl w-full mx-auto flex flex-col items-center z-10">
        {/* Branding */}
        <div className="mb-12">
          <Link to="/" className="font-display text-3xl text-premium-gold tracking-tight">
            Elycapvest
          </Link>
        </div>

        {/* Confirmation card */}
        <section className="glass-panel w-full max-w-3xl p-8 md:p-glass-padding rounded-lg text-center animate-fade-in">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-full border border-success-emerald bg-success-emerald/10 text-success-emerald">
            <span className="material-symbols-outlined text-4xl">check_circle</span>
          </div>
          <h2 className="font-display text-4xl text-on-surface mb-4 leading-tight">Thank You</h2>
          <p className="text-lg text-on-surface-variant max-w-xl mx-auto mb-8">
            Your expression of interest in{" "}
            <span className="text-on-surface font-medium">{property.title}</span> has been securely
            registered. Our investment team will review your profile and reach out within 24–48
            hours to discuss next steps.
          </p>

          {/* Submission details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-[rgba(248,246,241,0.15)] py-6 mb-8 text-left">
            <Detail label="Property" value={property.title} />
            <Detail
              label="Asset Value"
              value={property.project_value ? `₦${property.project_value.toLocaleString()}` : "—"}
            />
            <Detail
              label="Per Fraction"
              value={property.fraction_price ? `₦${property.fraction_price.toLocaleString()}` : "—"}
            />
            <Detail label="Confirmation Sent To" value={email} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 data-stat text-[14px]">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span className="text-on-surface-variant">
                RESPONSE WINDOW:{" "}
                <span className="text-premium-gold uppercase tracking-widest">24–48H</span>
              </span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-[rgba(248,246,241,0.15)]" />
            <div className="flex items-center gap-2 data-stat text-[14px]">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span className="text-on-surface-variant">
                STATUS: <span className="text-success-emerald uppercase tracking-widest">SUBMITTED</span>
              </span>
            </div>
          </div>
        </section>

        {/* What happens next */}
        <section className="mt-16 w-full max-w-5xl">
          <div className="flex items-center justify-between mb-8 border-b border-[rgba(248,246,241,0.15)] pb-4">
            <h3 className="label-caps text-premium-gold">What Happens Next</h3>
            <span className="data-stat text-[11px] text-on-surface-variant">CONTINUE YOUR JOURNEY</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Step
              icon="mark_email_read"
              title="Email Confirmation"
              description={`You'll receive a confirmation email at ${email} with your submission reference.`}
            />
            <Step
              icon="fact_check"
              title="Details Verification"
              description="Our investment team will verify your details and perform necessary checks."
            />
            <Step
              icon="description"
              title="Investment Documentation"
              description="You'll receive official documentation, terms & conditions, and secure payment instructions."
            />
            <Step
              icon="account_balance_wallet"
              title="Payment & Fraction Allocation"
              description="Complete your payment through our secure portal to finalize your fraction purchase."
            />
          </div>
        </section>

        {/* Disclaimer + CTA */}
        <div className="mt-12 w-full max-w-3xl glass-panel rounded-lg p-5 border-l-2 border-l-premium-gold">
          <h4 className="label-caps text-premium-gold mb-1">Important</h4>
          <p className="text-sm text-on-surface-variant">
            Submitting this interest does not constitute a binding investment agreement. Your
            investment will only be confirmed after signing official documentation and completing
            payment.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/investor/dashboard" className="btn-gold px-10 py-4 text-[12px]">
            Go to Dashboard
          </Link>
          <Link to="/properties" className="btn-ghost px-10 py-4 label-caps text-on-surface">
            Browse More Properties
          </Link>
        </div>
      </div>
    </main>
  );
};

export default InterestSuccess;

const Detail: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="min-w-0">
    <p className="label-caps text-[10px] text-on-surface-variant mb-1">{label}</p>
    <p className="data-stat text-on-surface text-sm truncate">{value}</p>
  </div>
);

const Step: FC<{ icon: string; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <div className="group glass-panel glass-panel-hover p-glass-padding rounded-lg flex items-start gap-5">
    <div className="p-3 bg-premium-gold/10 rounded-lg shrink-0">
      <span className="material-symbols-outlined text-premium-gold text-2xl">{icon}</span>
    </div>
    <div>
      <h4 className="font-display text-xl text-on-surface mb-1">{title}</h4>
      <p className="text-on-surface-variant text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);
