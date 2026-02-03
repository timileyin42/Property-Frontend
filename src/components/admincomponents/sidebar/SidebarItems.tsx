// components/Sidebar/SidebarItem.tsx
import { NavLink } from "react-router-dom";
import { ReactNode } from "react";

export interface SidebarItemProps {
  to: string;
  label: string;
  icon: ReactNode;
}

const SidebarItem = ({ to, label, icon }: SidebarItemProps) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `
        flex items-center gap-4 border border-red-3xl rounded-md
        text-sm font-medium transition-colors
        ${
          isActive
            ? "bg-white-700 text-white"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }
        `
      }
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

export default SidebarItem;
