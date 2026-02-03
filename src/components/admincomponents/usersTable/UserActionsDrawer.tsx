// src/features/admin/users/UserActionsDrawer.tsx
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AdminUser } from "../../../types/user";
import { deactivateUser, deleteUser, updateUserRole } from "../../../api/admin.users.api";

interface Props {
  user: AdminUser;
  onClose: () => void;
  onRefresh?: () => void;
}

export const UserActionsDrawer = ({ user, onClose, onRefresh }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRoleUpdate = async (role: "ADMIN" | "INVESTOR") => {
    try {
      setIsSubmitting(true);
      await updateUserRole(user.id, role);
      toast.success(`User updated to ${role.toLowerCase()}`);
      onRefresh?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      setIsSubmitting(true);
      await deactivateUser(user.id);
      toast.success("User deactivated");
      onRefresh?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to deactivate user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this user?");
    if (!confirmDelete) return;

    try {
      setIsSubmitting(true);
      await deleteUser(user.id);
      toast.success("User deleted");
      onRefresh?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="w-80 bg-white h-2/3 shadow-xl p-4 space-y-3">
        <button onClick={onClose} className="text-sm text-gray-500">
          Close
        </button>

        <h3 className="font-semibold">{user.full_name}</h3>

        <Action
          label="Make Investor"
          onClick={() => handleRoleUpdate("INVESTOR")}
          disabled={isSubmitting}
        />
        <Action
          label="Make Admin"
          onClick={() => handleRoleUpdate("ADMIN")}
          disabled={isSubmitting}
        />
        <Action
          label="Assign Investment"
          onClick={() => {
            onClose();
            navigate(`/admindashboard/assign-investment?userId=${user.id}`);
          }}
          disabled={isSubmitting}
        />
        <Action
          label="View Profile"
          onClick={() => {
            onClose();
            navigate(`/admindashboard/users/${user.id}`);
          }}
          disabled={isSubmitting}
        />
        <Action
          label="Edit User"
          onClick={() => toast("Edit User coming soon")}
          disabled={isSubmitting}
        />
        <Action
          label="Deactivate"
          onClick={handleDeactivate}
          disabled={isSubmitting}
        />

        <button
          className="w-full text-left text-red-600 font-medium disabled:opacity-60"
          onClick={handleDelete}
          disabled={isSubmitting}
        >
          Delete User
        </button>
      </div>
    </div>
  );
};

const Action = ({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    className="w-full text-left py-2 hover:bg-gray-100 rounded disabled:opacity-60"
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </button>
);
