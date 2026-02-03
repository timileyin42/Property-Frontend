// src/features/admin/users/UserRowActions.tsx
import { useState } from "react";
import { AdminUser } from "../../../types/user";
import { UserActionsDrawer } from "./UserActionsDrawer";

interface Props {
  user: AdminUser;
  onRefresh?: () => void;
}

export const UserRowActions = ({ user, onRefresh }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-2 text-xl font-bold"
      >
        ⋮
      </button>

      {open && (
        <UserActionsDrawer
          user={user}
          onClose={() => setOpen(false)}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
};
