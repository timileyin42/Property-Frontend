// layout/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/admincomponents/sidebar/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden min-h-0">
      <div className=" md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="md:ml-64 ml-20 flex-1 min-w-0 bg-gray-50 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
