// components/StatusBadge.tsx
import { SuccessCheckIcon, ClockIcon } from "../components/svgs/ShieldIcon";
import {InterestStatus} from "../types/investment"
import { IoClose } from "react-icons/io5";



// 1. Define the possible statuses as a union type

// 2. Define the Props interface
interface Props {
  status: InterestStatus;
}

// 3. Create a type for the status configuration
interface StatusConfig {
  color: string;
  icon?: JSX.Element;
  label: string;
}

// 4. Create a typed configuration map using Record type
const STATUS_CONFIG: Record<InterestStatus, StatusConfig> = {
  NEW: {
      color: "bg-green-500 text-white",
      icon: <ClockIcon size={14} className="mr-1.5" />,
      label: "New",
    },
    
    ACTIVE: {
      color: "bg-green-100 text-green-700",
      icon: <SuccessCheckIcon size={14} className="mr-1.5" />,
      label: "Active", // Different label for UI
    },
    REJECTED: {
      color: "bg-red-100 text-red-700",
      icon: <IoClose size={14} className="mr-1.5" />,
      label: "Rejected",
    },
    PENDING: {
      color: "bg-gray-100 text-gray-600",
      icon: <ClockIcon size={14} className="mr-1.5" />,
      label: "Pending",
    },
    SOLD: {
      color: "bg-gray-900 text-gray-600",
      icon: <SuccessCheckIcon size={14} className="mr-1.5" />,
      label: "Sold",
    },
     AVAILABLE: {
      color: "bg-emerald-600 text-gray-600",
      icon: <SuccessCheckIcon size={14} className="mr-1.5" />,
      label: "Available",
    },
     APPROVED: {
      color: "bg-green-900 text-gray-600",
      icon: <SuccessCheckIcon size={14} className="mr-1.5" />,
      label: "Approved",
    },
    CONTACTED: {
      color: "bg-black text-white",
      icon: <SuccessCheckIcon size={14} className="mr-1.5" />,
      label: "Contacted",
    },
    CLOSED: {
      color: "bg-red-600 text-white",
      icon: <IoClose size={14} className="mr-1.5 border rounded-full" />,
      label: "Closed",
    },
    INVESTED: {
      color: "bg-blue-600 text-white",
      icon: <SuccessCheckIcon size={14} className="mr-1.5" />,
      label: "Invested",
    },
};

// 5. Define the component with proper TypeScript typing
export const StatusBadge: React.FC<Props> = ({ status }) => {
  // Grab the config for the current status, fallback to PENDING if not found
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;

  const baseClasses = "px-2 text-white py-1 rounded-full text-xs inline-flex items-center transition-colors";

  return (
    <div className={`${baseClasses} ${config.color}`}>
      {config.icon}
      <span>{status}</span>
    </div>
  );
};

// 6. Alternative simple status badge (optional - keep if you need it)
const STATUS_STYLES: Record<InterestStatus, string> = {
  NEW: "bg-green-900 text-white",
  ACTIVE: "bg-green-900 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  AVAILABLE: "bg-emerald-600 text-white",
  SOLD: "bg-gray-100 text-gray-700",
  REJECTED: "bg-red-100 text-red-700",
  APPROVED: "bg-green-900 text-green-700",
  CONTACTED: "bg-black text-white",
  CLOSED: "bg-red-100 text-white",
  INVESTED: "bg-blue-600 text-white",
};
interface SimpleBadgeProps {
  status: InterestStatus;
}

export const Interest_StatusBadge: React.FC<SimpleBadgeProps> = ({ status }) => (
  <div>
  <span
    className={`px-3 py-1 rounded-full text-xs  font-medium ${STATUS_STYLES[status]}`}
  >
    {status.charAt(0) + status.slice(1).toLowerCase()}
  </span>

</div>
);
