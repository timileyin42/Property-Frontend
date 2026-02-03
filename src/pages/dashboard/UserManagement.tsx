
import { useEffect, useMemo, useState} from "react";
// import { LuLogOut } from "react-icons/lu";
import toast, {Toaster} from "react-hot-toast"
// import type { PortfolioStat } from "../types/dashboard";
// import {ShieldIcon, TrendUpIcon, UsersIcon} from "../components/svgs/ShieldIcon"


// import AvailableProperties from "../investorsData/AvailableProperties";
// import {fetchAdminUsers} from "../../api/fetchAdminUsers"
import {UsersTable} from "../../components/admincomponents/usersTable/UserTable"
import DashboardStats from "../../components/admincomponents/DashboardStats";
import { useUsers } from "../../components/features/users/useUsers";

// interface AdminUser {
//   id: number;
//   email: string;
//   role: "ADMIN" | "INVESTOR";
//   isActive: boolean;
//   created_at: string;
// }

const UserManagement = () => {
 const { users, loading, error, reload } = useUsers();


    // const [properties, setProperties] = useState<Property[]>([]);
// const [loadingProperties, setLoadingProperties] = useState(true);


  // search and filter function
 const [search, setSearch] = useState("");
const [roleFilter, setRoleFilter] = useState<
  "ALL" | "ADMIN" | "INVESTOR" | "PUBLIC"
>("ALL");

const filteredUsers = useMemo(() => {
  if (!Array.isArray(users)) return [];

  return users.filter((user) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      user.email.toLowerCase().includes(searchValue) ||
      user.full_name?.toLowerCase().includes(searchValue) ||
      user.phone?.includes(searchValue);

    const matchesRole =
      roleFilter === "ALL" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });
}, [users, search, roleFilter]);

// fetching users details 

 useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) return <p>Loading users...</p>;
  return (
    <div className="mx-auto px-4">
     <Toaster />
      <section>
        <div className="pt-6 mb-8">
          <h2 className="font-bold text-blue-900 text-3xl">
            Admin Dashboard
          </h2>
          <p className="text-gray-400 text-sm">
            Manage properties, users, and investment interests
          </p>
        </div>

        <DashboardStats />
      </section>
        {/* ===== GRAPH SECTION (Placeholder) ===== */}
      <section className="my-12 border border-gray-300  rounded-xl">

<div className="flex flex-col md:flex-row gap-4 mb-4">
  {/* Search */}
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search by name, email or phone"
    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/2"
  />

  {/* Role Filter */}
  <select
    value={roleFilter}
    onChange={(e) =>
      setRoleFilter(e.target.value as typeof roleFilter)
    }
    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/4"
  >
    <option value="ALL">All Roles</option>
    <option value="ADMIN">Admin</option>
    <option value="INVESTOR">Investor</option>
    <option value="PUBLIC">Public</option>
  </select>
</div>


        <UsersTable users={filteredUsers} onRefresh={reload} />
      </section>

      {/* ===== AVAILABLE PROPERTIES / STATS ===== */}

      
    </div>
  );
};

export default UserManagement;
