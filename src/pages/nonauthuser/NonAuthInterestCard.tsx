// components/admincomponents/NonAuthInterestCard.tsx
import { NonAuthenticatedInterest } from "../../types/interest";

interface NonAuthInterestCardProps {
  interest: NonAuthenticatedInterest;
}

export const NonAuthInterestCard: React.FC<NonAuthInterestCardProps> = ({ interest }) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold">{interest.name}</h3>
          <p className="text-sm text-gray-500">{interest.email}</p>
          <p className="text-sm text-gray-500">{interest.phone}</p>
        </div>
        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
          Non-Authenticated
        </span>
      </div>
      
      <div className="mb-3">
        <p className="text-sm font-medium mb-1">Property:</p>
        <p className="text-sm text-gray-600">
          {interest.property_title || `Property #${interest.property_id}`}
        </p>
      </div>
      
      <div className="mb-3">
        <p className="text-sm font-medium mb-1">Message:</p>
        <p className="text-sm text-gray-600">{interest.message}</p>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {new Date(interest.created_at).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <button className="text-blue-600 text-sm">View</button>
          <button className="text-green-600 text-sm">Contact</button>
          <button className="text-red-600 text-sm">Delete</button>
        </div>
      </div>
    </div>
  );
};