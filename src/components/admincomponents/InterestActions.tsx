// components/InterestActions.tsx
import { useState } from "react";
import { InvestorInterest } from "../../types/investment";
import { UpdateInterestModal } from "./UpdateInterestModal";

interface Props {
  interest: InvestorInterest;
  onUpdate?: (updatedInterest: InvestorInterest) => void;
}

export const InterestActions = ({ interest, onUpdate }: Props) => {
  const [open, setOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleUpdateClick = () => {
    setOpen(false);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSuccess = (updatedInterest: InvestorInterest) => {
    if (onUpdate) {
      onUpdate(updatedInterest);
    }
  };

  // const handleApprove = async () => {
  //   // Implement approve logic here
  //   setOpen(false);
  // };

  // const handleReject = async () => {
  //   // Implement reject logic here
  //   setOpen(false);
  // };

  // const handleDelete = async () => {
  //   // Implement delete logic here
  //   setOpen(false);
  // };

  return (
    <>
      <div className="relative">
        <button 
          onClick={() => setOpen((o) => !o)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <span className="text-xl">⋮</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
            <button
              onClick={handleUpdateClick}
              className="block w-full px-4 py-3 text-left hover:bg-gray-50 text-sm text-blue-900"
            >
              Update Status
            </button>

            {/* <button
              onClick={handleApprove}
              className="block w-full px-4 py-3 text-left hover:bg-gray-50 text-sm text-green-600"
            >
              ✅ Approve
            </button>

            <button
              onClick={handleReject}
              className="block w-full px-4 py-3 text-left hover:bg-gray-50 text-sm text-red-600"
            >
              ❌ Reject
            </button>

            <button
              onClick={handleDelete}
              className="block w-full px-4 py-3 text-left hover:bg-gray-50 text-sm text-red-600 border-t"
            >
              🗑️ Delete
            </button> */}
          </div>
        )}
      </div>

      <UpdateInterestModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        interest={interest}
        onUpdate={handleUpdateSuccess}
      />
    </>
  );
};