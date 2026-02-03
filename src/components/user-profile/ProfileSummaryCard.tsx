import React from "react";
import { formatDate } from "../../util/formatDate";
import type { User } from "../../types/userProfile";

const phoneIcon = "https://www.figma.com/api/mcp/asset/d1dc743c-f52b-42eb-9c37-29cbbeb7baa2";
const locationIcon = "https://www.figma.com/api/mcp/asset/244bf116-539b-4479-86e1-b1259937c273";
const calendarIcon = "https://www.figma.com/api/mcp/asset/4b1deb07-4300-4026-a40e-fdb318c4f7d7";

interface ProfileSummaryCardProps {
  user: User;
  location?: string;
}

const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({
  user,
  location = "",
}) => {
  const initials = user.full_name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white border border-black/10 rounded-[14px] p-6 w-full">
      <div className="flex flex-col items-center text-center">
        <div className="bg-[#1e3a8a] rounded-full h-24 w-24 flex items-center justify-center text-white text-[30px] font-bold leading-[36px]">
          {initials}
        </div>
        <p className="mt-4 text-[#1e3a8a] text-[20px] font-medium leading-[28px]">
          {user.full_name}
        </p>
        <p className="text-[#717182] text-[16px] leading-[24px]">
          {user.email}
        </p>
        <span className="mt-3 inline-flex items-center justify-center border border-[#1e3a8a] bg-[#eff6ff] text-[#1e3a8a] text-[12px] font-medium leading-[16px] px-[9px] py-[3px] rounded-[8px]">
          {user.role}
        </span>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <div className="flex items-center gap-3 text-[#4a5565] text-[14px] leading-[20px]">
          <img src={phoneIcon} alt="" className="h-4 w-4" />
          <span>{user.phone ?? "Not provided"}</span>
        </div>
        <div className="flex items-center gap-3 text-[#4a5565] text-[14px] leading-[20px]">
          <img src={locationIcon} alt="" className="h-4 w-4" />
          <span>{location || "Not provided"}</span>
        </div>
        <div className="flex items-center gap-3 text-[#4a5565] text-[14px] leading-[20px]">
          <img src={calendarIcon} alt="" className="h-4 w-4" />
          <span>{`Joined ${formatDate(user.created_at)}`}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummaryCard;
