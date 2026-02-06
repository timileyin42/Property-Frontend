import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TabsHeader, { UserProfileTab } from "../../components/user-profile/TabsHeader";
import ProfileSummaryCard from "../../components/user-profile/ProfileSummaryCard";
import UpdateProfileForm from "../../components/user-profile/UpdateProfileForm";
import InquiriesTab from "../../components/user-profile/InquiriesTab";
import SavedPropertiesTab from "../../components/user-profile/SavedPropertiesTab.tsx";
import { api } from "../../api/axios";
import type { User } from "../../types/userProfile";

const headerIcon = "https://www.figma.com/api/mcp/asset/4ede3ae4-3e6d-40d2-b83d-2d0285389d26";

const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<UserProfileTab>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleTabChange = (tab: UserProfileTab) => {
    setActiveTab(tab);
    setIsEditing(false);
  };

  const fetchProfile = async (showLoader: boolean = false) => {
    if (showLoader) {
      setIsLoading(true);
    }

    try {
      const res = await api.get<User>("/user/profile");
      setProfile(res.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProfile(true);
  }, []);

  return (
    <div className="bg-[#f9fafb] min-h-screen">
      <header className="bg-white border-b border-[#e5e7eb]">
        <div className="mx-auto max-w-[1232px] px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#1e3a8a] rounded-[10px] h-10 w-10 flex items-center justify-center">
              <img src={headerIcon} alt="" className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[#1e3a8a] text-[24px] font-semibold leading-[32px]">
                Elycap Luxury Homes
              </p>
              <p className="text-[#4a5565] text-[14px] leading-[20px]">
                User Profile
              </p>
            </div>
          </div>
          <Link
            to="/investor/dashboard"
            className="border border-[#1e3a8a] text-[#1e3a8a] rounded-[8px] h-9 px-4 inline-flex items-center justify-center text-[14px] font-medium leading-[20px]"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1232px] px-4 sm:px-6 lg:px-8 py-8">
        <TabsHeader activeTab={activeTab} onChange={handleTabChange} />

        <div className="mt-8">
          {isLoading && (
            <p className="text-[#6a7282] text-[14px] leading-[20px]">
              Loading profile...
            </p>
          )}

          {!isLoading && profile && activeTab === "profile" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[387px_1fr]">
              <ProfileSummaryCard user={profile} />
              <UpdateProfileForm
                user={profile}
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onCancel={() => setIsEditing(false)}
                onProfileUpdated={(updatedUser) => {
                  setProfile(updatedUser);
                  fetchProfile();
                }}
              />
            </div>
          )}

          {!isLoading && activeTab === "inquiries" && <InquiriesTab />}

          {!isLoading && activeTab === "saved" && <SavedPropertiesTab />}
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage;
