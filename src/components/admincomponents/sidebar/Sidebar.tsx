// components/Sidebar/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { sidebarItems } from "./SidebarConfig";
import BuildingIcon from "../../svgs/BuildingIcon"
import {LogoutIcon} from "../../svgs/ShieldIcon"
import {useAuth} from "../../../context/AuthContext";



export const Sidebar = () => {
  const {user, logout} = useAuth();
  return (
    <aside className="fixed left-0 top-0 h-screen w-20  md:w-64 bg-blue-900 text-white px-2 transition">
      <div className="p-4 text-xl font-bold">
       <a
            href="/"
            className="flex  items-center gap-1 text-lg font-semibold font-inter text-white-900 whitespace-nowrap "
          >
          <BuildingIcon color="white" />

            <span>Elycapvest</span>
          </a></div>

      <nav className={`mt-6 space-y-1 flex flex-col gap-3 relative justify-center md:justify-start`}>
        {sidebarItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition
              ${isActive ? "bg-white/60 bg-opacity-60" : "hover:bg-slate-800"}`
            }
          >
            {item.icon}
            <span className={`hidden md:block`}>{item.label}</span>
          </NavLink>
        ))}




      </nav>

       {/* User info and logout button container */}
      
<div className="absolute bottom-0 left-0 w-full  border-slate-700 gap-3 p-4">

  <div className="flex flex-col justify-between gap-3">
    <hr />
    {/* User info */}
    <div className="flex flex-col min-w-0"> 
      <p className="font-bold truncate text-sm">{user?.full_name}</p>
      <span className="text-xs truncate opacity-70">{user?.email}</span>
    </div>

    {/* Logout Button */}
    <button 
      className="p-2 rounded-md transition hover:bg-white opacity-70 flex items-center shrink-0"
      onClick={logout}
    >
      <LogoutIcon size={20} />
      <span className="ml-2 hidden lg:inline">Logout</span>
    </button>
    
  </div>
</div>
    </aside>
  );
};
