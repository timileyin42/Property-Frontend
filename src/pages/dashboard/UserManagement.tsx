
import { useEffect, useMemo, useState} from "react";
// import { LuLogOut } from "react-icons/lu";
import toast, {Toaster} from "react-hot-toast"
// import type { PortfolioStat } from "../types/dashboard";
// import {ShieldIcon, TrendUpIcon, UsersIcon} from "../components/svgs/ShieldIcon"


// import AvailableProperties from "../investorsData/AvailableProperties";
// import {fetchAdminUsers} from "../../api/fetchAdminUsers"
import {UsersTable} from "../../components/admincomponents/usersTable/UserTable"
import { useUsers } from "../../components/features/users/useUsers";

// interface AdminUser {
//   id: number;
//   email: string;
//   role: "ADMIN" | "INVESTOR";
//   isActive: boolean;
//   created_at: string;
// }

export interface PortfolioStat {
  id: number;
  title: string;
  value: string | number;
  description: string;
}


const UserManagement = () => {
 const { users, loading, error } = useUsers();


    // const [properties, setProperties] = useState<Property[]>([]);
// const [loadingProperties, setLoadingProperties] = useState(true);

  const portfolioStats: PortfolioStat[] = [
    {
      id: 1,
      title: "Total Investment",
      value: "₦96,100,000",
      description: "+12.3% this month",
    },
    {
      id: 2,
      title: "Fractional Investment",
      value: "45",
      description:
        "Across 3 properties",
    },
    {
      id: 3,
      title: "Properties",
      value: "3",
      description:
        "Active investments",
    },
     {
      id: 4,
      title: "Avg. Growth",
      value: "+12.0%",
      description:
        "6 month average",
    },
  ];






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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {portfolioStats.map((item, index) => {
          	const isLast = index === portfolioStats.length - 1;


          	return (

            <div
              key={item.id}
              className="border border-gray-200 bg-white shadow-lg rounded-xl"
            >
              <div className="p-8 flex flex-col gap-4">
              

                <h3 className="text-gray-400">
                  {item.title}
                </h3>

                <p className={`text-2xl font-semibold ${isLast ? "text-green-600" : "text-blue-900"}`}>
            {item.value}
          </p>

                <p className="text-gray-400 text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          )})}
        </div>
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


        <UsersTable users={filteredUsers} />
      </section>

      {/* ===== AVAILABLE PROPERTIES / STATS ===== */}

      
    </div>
  );
};

export default UserManagement;
