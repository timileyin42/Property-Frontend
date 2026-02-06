import { useRef } from "react";
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

// Define the contact endpoint response type
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

const InterestForm: React.FC<InterestFormProps> = ({ property }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const idempotencyKeyRef = useRef<string>(uuidv4());
  // const [isGuestMode, setIsGuestMode] = useState(false);

  const messageOptions = [
    `I am interested in investing in ${property.title}. Please share next steps.`,
    `Please send me more details about ${property.title} and available fractions.`,
    `I would like a call to discuss investment options for ${property.title}.`,
    `Kindly share the expected returns and payment plan for ${property.title}.`,
  ];

  // Initialize form with user data if authenticated
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: isAuthenticated
      ? {
          name: user?.full_name ?? "",
          email: user?.email ?? "",
          phone: user?.phone ?? "",
          message: "",
          property_id: property.id,
        }
      : {
          name: "",
          email: "",
          phone: "",
          message: "",
          property_id: property.id,
        },
  });

  // Handle form submission for both authenticated and unauthenticated users
  const onSubmit = async (data: ContactFormValues) => {
    if (isSubmitting) return;

    try {
      if (isAuthenticated) {
        // Authenticated user - use /user/interests endpoint
        const res = await api.post(
          "/user/interests",
          data
          
        );

        // if (!res.data?.success) {
        //   throw new Error("Submission failed");
        // }

        const successPayload: InterestSuccessData = {
          property,
          email: data.email,
        };

        toast.success(res.data.message);

        navigate("/interest-success", {
          replace: true,
          state: successPayload,
        });
      } else {
        // Unauthenticated user - use /contact endpoint
        const res = await api.post<ContactResponse>(
          "/contact",
          {
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: data.message,
            property_id: data.property_id,
          }
        );

        // Reset idempotency key for next submission
        idempotencyKeyRef.current = uuidv4();

        // Show success message
        toast.success(res.data.message)

        // For unauthenticated users, you might want to:
        // 1. Show a success message and reset form
        // 2. Redirect to thank you page
        // 3. Or show login prompt
        reset();
        
        // Optionally show login prompt or redirect
        // navigate("/thank-you");
      }
    } catch (err: unknown) {
      // Reset idempotency key on error
      idempotencyKeyRef.current = uuidv4();
      
      const error = err as {
        response?: { data?: { detail?: string; message?: string } };
        message?: string;
      };
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  // If user is not logged in, show the form but with guest mode enabled
  if (!isAuthenticated) {
    return (
      <div>
        <Toaster />
        
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You are not logged in. You can still submit 
            your interest, but you won't be able to track it later.{" "}
            <a 
              href="/login" 
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Log in
            </a>{" "}
            or{" "}
            <a 
              href="/signup" 
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Sign up
            </a>{" "}
            for full access.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 space-y-4"
        >
          <h3 className="font-semibold text-lg">Investment Interest Form</h3>
          <p className="text-sm text-gray-600">
            Fill out the form below to express your interest in this property.
          </p>

          <div>
            <input
              {...register("name")}
              placeholder="Full Name *"
              className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
          </div>

          <div>
            <input
              {...register("email")}
              placeholder="Email *"
              className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>

          <div>
            <input
              {...register("phone")}
              placeholder="Phone Number *"
              className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-red-500 text-sm mt-1">{errors.phone?.message}</p>
          </div>

          <div>
            <select
              {...register("message")}
              className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              defaultValue=""
            >
              <option value="" disabled>
                Select a message *
              </option>
              {messageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <p className="text-red-500 text-sm mt-1">{errors.message?.message}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Note:</h4>
            <p className="text-sm text-gray-600">
              Submitting this form does not constitute a binding agreement. 
              Our team will review your interest and contact you with next 
              steps and official investment documentation.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-900 hover:bg-blue-800 text-white w-full py-3 rounded-md disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Submit Interest"}
          </button>
        </form>
      </div>
    );
  }

  // Authenticated user form (your existing code with minor improvements)
  return (
    <div>
      <Toaster />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 space-y-4"
      >
        <h3 className="font-semibold text-lg">Investment Interest Form</h3>
        <p className="text-sm text-gray-600">
          Fill out the form below to express your interest in this property.
        </p>

        <div>
          <input
            {...register("name")}
            placeholder="Full Name *"
            disabled={true}
            className="w-full bg-gray-100 rounded-md p-2 text-gray-600"
          />
          <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
        </div>

        <div>
          <input
            {...register("email")}
            placeholder="Email *"
            disabled={true}
            className="w-full bg-gray-100 rounded-md p-2 text-gray-600"
          />
          <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
        </div>

        <div>
          <input
            {...register("phone")}
            placeholder="Phone Number *"
            disabled={true}
            className="w-full bg-gray-100 rounded-md p-2 text-gray-600"
          />
          <p className="text-red-500 text-sm mt-1">{errors.phone?.message}</p>
        </div>

        <div>
          <select
            {...register("message")}
            className="w-full border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md p-2"
            defaultValue=""
          >
            <option value="" disabled>
              Select a message *
            </option>
            {messageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <p className="text-red-500 text-sm mt-1">{errors.message?.message}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Note:</h4>
          <p className="text-sm text-gray-600">
            Submitting this form does not constitute a binding agreement. 
            Our team will review your interest and contact you with next 
            steps and official investment documentation.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-900 hover:bg-blue-800 text-white w-full py-3 rounded-md disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Interest"}
        </button>
      </form>
    </div>
  );
};

export default InterestForm;
