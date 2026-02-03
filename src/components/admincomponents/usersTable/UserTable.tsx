import { AdminUser } from "../../../types/user";
import { UserRowActions } from "./UserRowActions";

interface Props {
  users: AdminUser[];
  onRefresh?: () => void;
}

export const UsersTable = ({ users, onRefresh }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto p-4">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-4">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-gray-200">
              <td className="p-4 font-medium">{user.full_name}</td>
              <td>{user.email}</td>

              <td>
                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                  {user.role}
                </span>
              </td>

              <td>
                {new Date(user.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>

              <td>
                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                  Active
                </span>
              </td>

              <td className="text-right pr-4">
                <UserRowActions user={user} onRefresh={onRefresh} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
