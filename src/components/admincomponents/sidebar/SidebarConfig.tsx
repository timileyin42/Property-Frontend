// components/Sidebar/sidebarConfig.ts
import { ReactNode } from "react";
import { FiUpload } from "react-icons/fi";

// import {
//   InterestIcon,
//   HomeIcon,
//   LogoutIcon,
//   UserIcon
// } from "@components/svgs";
import {UsersIcon, InterestIcon, HomeIcon} from "../../../components/svgs/ShieldIcon"

export interface SidebarItem {
  label: string;
  path: string;
  icon: ReactNode;
}

export const sidebarItems: SidebarItem[] = [
  {
    label: "Interest Received",
    path: "/admindashboard",
    icon: <InterestIcon  />
  },
  {
    label: "Upload Properties",
    path: "uploadproperties",
    icon: <FiUpload  />
  },
  {
    label: "User Management",
    path: "user_management",
    icon: <UsersIcon />
  },
  {
    label: "Home",
    path: "/",
    icon: <HomeIcon />
  },
  
];
