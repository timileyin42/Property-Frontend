// src/features/admin/users/useUsers.ts
import { useEffect, useState } from "react";
import { fetchAdminUsers } from "../../../api/admin.users.api";
import { AdminUser } from "../../../types/user";

export const useUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminUsers();

      setUsers(res);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return { users, loading, error, reload: loadUsers };
};
