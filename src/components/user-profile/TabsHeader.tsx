import React from "react";

export type UserProfileTab = "profile" | "inquiries" | "saved";

interface TabsHeaderProps {
  activeTab: UserProfileTab;
  onChange: (tab: UserProfileTab) => void;
}

const profileIcon = "https://www.figma.com/api/mcp/asset/ce93c3b3-240e-4aa5-877a-098a4ea2c918";
const inquiriesIcon = "https://www.figma.com/api/mcp/asset/76aa4846-3789-4fc6-b707-07ee861698ed";
const savedIcon = "https://www.figma.com/api/mcp/asset/5d1ac905-c822-478e-b052-b0d87ecf1735";

const tabs: Array<{ key: UserProfileTab; label: string; icon: string }> = [
  { key: "profile", label: "Profile", icon: profileIcon },
  { key: "inquiries", label: "Inquiries", icon: inquiriesIcon },
  { key: "saved", label: "Saved", icon: savedIcon },
];

const TabsHeader: React.FC<TabsHeaderProps> = ({ activeTab, onChange }) => {
  return (
    <div className="bg-[#ececf0] rounded-[14px] p-[3px] inline-flex w-full max-w-[448px]">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`h-[29px] min-w-[147px] rounded-[14px] flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] transition-colors ${
              isActive ? "bg-[#1e3a8a] text-white" : "text-[#0a0a0a]"
            }`}
          >
            <img
              src={tab.icon}
              alt=""
              className={`h-4 w-4 ${isActive ? "brightness-0 invert" : ""}`}
            />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TabsHeader;
