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
import BuildingIcon from "../../../components/svgs/BuildingIcon";

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
    label: "Properties",
    path: "properties",
    icon: <BuildingIcon size={20} color="white" />
  },
  {
    label: "Updates",
    path: "updates",
    icon: <InterestIcon />
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
