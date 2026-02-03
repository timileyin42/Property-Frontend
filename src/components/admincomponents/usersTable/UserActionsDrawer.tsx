// src/features/admin/users/UserActionsDrawer.tsx
import { AdminUser } from "../../../types/user";

interface Props {
  user: AdminUser;
  onClose: () => void;
}

export const UserActionsDrawer = ({ user, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="w-80 bg-white h-2/3 shadow-xl p-4 space-y-3">
        <button onClick={onClose} className="text-sm text-gray-500">
          Close
        </button>

        <h3 className="font-semibold">{user.full_name}</h3>

        <Action label="Make Investor" />
        <Action label="Make Admin" />
        <Action label="Assign Investment" />
        <Action label="View Profile" />
        <Action label="Edit User" />
        <Action label="Deactivate" />

        <button className="w-full text-left text-red-600 font-medium">
          Delete User
        </button>
      </div>
    </div>
  );
};

const Action = ({ label }: { label: string }) => (
  <button className="w-full text-left py-2 hover:bg-gray-100 rounded">
    {label}
  </button>
);
