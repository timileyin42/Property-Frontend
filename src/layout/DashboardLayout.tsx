// layout/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/admincomponents/sidebar/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex">
      <div className=" md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="md:ml-64 ml-20 min-h-screen w-full bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
