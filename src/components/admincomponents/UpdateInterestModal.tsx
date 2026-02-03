// components/UpdateInterestModal.tsx
import { useState } from "react";
import { updateInvestorInterest } from "../../api/admin.interests";
import toast from "react-hot-toast";
import { InvestorInterest, InterestStatus } from "../../types/investment";

interface UpdateInterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  interest: InvestorInterest;
  onUpdate: (updatedInterest: InvestorInterest) => void;
}

const STATUS_OPTIONS = [
  "NEW",
  "PENDING",
  "CONTACTED",
  "APPROVED",
  "REJECTED",
  "CLOSED",
];


export const UpdateInterestModal: React.FC<UpdateInterestModalProps> = ({
  isOpen,
  onClose,
  interest,
  onUpdate
}) => {
  const [status, setStatus] = useState(interest.status || "NEW");
  const [notes, setNotes] = useState(interest.notes || "");
  const [adminId, setAdminId] = useState(interest.assigned_admin_id?.toString() || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!status) {
      toast.error("Status is required");
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        status,
        notes: notes.trim() || undefined,
        assigned_admin_id: adminId ? parseInt(adminId) : undefined
      };

      const updatedInterest = await updateInvestorInterest(interest.id, updateData);
      
      toast.success("Interest updated successfully");
      onUpdate(updatedInterest);
      onClose();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Failed to update interest";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-100 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Update Interest</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
              disabled={loading}
            >
              ✕
            </button>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium">Investor: {interest.name}</p>
            <p className="text-sm text-gray-600">Property: {interest.property_title}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={status}
                    onChange={(e) => setStatus(e.target.value as InterestStatus)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Admin ID
                </label>
                <input
                  type="number"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional - Enter admin ID"
                  disabled={loading}
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add notes about this interest..."
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : "Update Interest"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};