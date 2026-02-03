import { Navigate, useLocation } from "react-router-dom";
import type { InterestSuccessData } from "../types/interest";
import type { FC } from "react";
import {InterestSuccessIcon} from "../components/svgs/ShieldIcon"
import AppNavbar from "../components/AppNavbar"

/* =======================
   PAGE
======================= */

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

  const {
    property,          // ✅ FULL PROPERTY OBJECT
    email,
  } = state;

  console.log("property state to success");
  console.log(state)
  return (
    <div className="max-w-xl mx-auto py-12 flex  flex-col items-center text-base">
     <AppNavbar 
        title="Investor Dashboard" 
        subtitle="Manage your fractional real estate portfolio" 
      />
      
        <div className="bg-green-100  inline-flex items-center justify-center rounded-full p-2">
      <InterestSuccessIcon size={48} color="green" />
                
        </div>
      <h2 className="text-xl font-semibold text-center text-blue-900">
        Interest Submitted Successfully!
      </h2>
      <p>Thank you for expressing interest in Luxury Apartment Lagos</p>
      <p>Our team will review your request and contact you within 24-48 hours.</p>

      

      <div className="mt-6 bg-blue-50 rounded-lg p-4 space-y-4  w-full">
        <div>
        <h3 className="font-semibold text-blue-900">Submission Details</h3>
      </div>
        <div className="flex items-center justify-between w-full">
          <Detail label="Property" value={property.title} />
        <Detail
          label="Investment Amount"
          value={`₦${property.project_value}`}
        />
        </div>
        <div className="flex items-center justify-between w-full">
         <Detail label="Number of Fractions" value={`${property.fraction_price}`} />
        <Detail label="Confirmation Email Sent To" value={email} />
        </div>
        
      </div>
      <div>
        {/*<div className="border">*/}
            <div className="mt-8 w-full border border-2 border-blue-900 rounded-xl p-5 space-y-5">
  {/* Header */}
  <div className="flex items-center gap-3">
    <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center text-sm font-semibold">
      i
    </div>
    <h3 className="font-semibold text-blue-900">
      What Happens Next?
    </h3>
  </div>

  {/* Steps */}
  <ul className="space-y-4">
    <Step
      step={1}
      title="Email Confirmation"
      description={`You'll receive a confirmation email at ${email} with your submission reference number.`}
    />

    <Step
      step={2}
      title="Details Verification"
      description="Our investment team will verify your details and perform necessary KYC checks."
    />

    <Step
      step={3}
      title="Investment Documentation"
      description="You'll receive official investment documentation, terms & conditions, and secure payment instructions."
    />

    <Step
      step={4}
      title="Payment & Fraction Allocation"
      description="Complete your payment through our secure portal to finalize your property fraction purchase."
    />

    <Step
      step={5}
      title="Welcome to Elycap Luxury Homes"
      description="Access your investor dashboard to track property performance, view returns, and manage your portfolio."
    />
  </ul>
</div>
  <div className="rounded-xl bg-yellow-50 p-3 border-l-amber-400 border-l-5 my-8">
    <h4 className="text-yellow-800 font-semibold">Important:</h4>
    <p>Submitting this interest does not constitute a binding investment agreement. Your investment will only be confirmed after signing official documentation and completing payment.</p>
  </div>

      </div>
    </div>
  );
};

export default InterestSuccess;

/* =======================
   UI COMPONENTS
======================= */

interface DetailProps {
  label: string;
  value: string;
}

const Detail: FC<DetailProps> = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-blue-900">{value}</p>
  </div>
);

interface StepProps {
  step: number;
  title: string;
  description: string;
}

const Step: FC<StepProps> = ({ step, title, description }) => (
  <li className="flex gap-4 items-start">
    <span className="w-7 h-7 shrink-0 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-semibold">
      {step}
    </span>
    <div>
      <p className="font-medium text-blue-900">{title}</p>
      <p className="text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  </li>
);

