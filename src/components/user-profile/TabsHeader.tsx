import React from "react";

export type UserProfileTab = "profile" | "inquiries" | "saved";

interface TabsHeaderProps {
  activeTab: UserProfileTab;
  onChange: (tab: UserProfileTab) => void;
}

const tabs: Array<{ key: UserProfileTab; label: string; icon: string }> = [
  { key: "profile", label: "Profile Info", icon: "person" },
  { key: "saved", label: "Saved Properties", icon: "bookmark" },
  { key: "inquiries", label: "My Inquiries", icon: "forum" },
];

const TabsHeader: React.FC<TabsHeaderProps> = ({ activeTab, onChange }) => {
  return (
    <div className="flex items-center gap-8 border-b border-[rgba(248,246,241,0.15)] overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`relative pb-4 label-caps whitespace-nowrap flex items-center gap-2 transition-colors ${
              isActive ? "text-secondary" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span>{tab.label}</span>
            {isActive && <span className="absolute -bottom-px left-0 w-full h-0.5 bg-secondary" />}
          </button>
        );
      })}
    </div>
  );
};

export default TabsHeader;
