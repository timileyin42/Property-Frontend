import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import TabsHeader, { UserProfileTab } from "../../components/user-profile/TabsHeader";
import ProfileSummaryCard from "../../components/user-profile/ProfileSummaryCard";
import UpdateProfileForm from "../../components/user-profile/UpdateProfileForm";
import InquiriesTab from "../../components/user-profile/InquiriesTab";
import SavedPropertiesTab from "../../components/user-profile/SavedPropertiesTab.tsx";
import { api } from "../../api/axios";
import type { User } from "../../types/userProfile";

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
    if (showLoader) setIsLoading(true);
    try {
      const res = await api.get<User>("/user/profile");
      setProfile(res.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile(true);
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar
        links={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
        ]}
      />

      <main className="pt-32 pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left sidebar: profile summary */}
          <aside className="md:col-span-4 lg:col-span-3 space-y-6">
            {profile && <ProfileSummaryCard user={profile} />}
          </aside>

          {/* Right content */}
          <section className="md:col-span-8 lg:col-span-9 space-y-6">
            {/* Banner */}
            <div className="h-40 rounded-xl overflow-hidden relative border border-[rgba(248,246,241,0.15)] bg-gradient-to-r from-primary-container to-surface-high">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h1 className="font-display text-2xl text-white">Investment Dashboard</h1>
                <p className="text-on-surface-variant text-sm">
                  Manage your personal information and track your fractional assets.
                </p>
              </div>
            </div>

            <TabsHeader activeTab={activeTab} onChange={handleTabChange} />

            <div>
              {isLoading && (
                <p className="text-on-surface-variant text-sm">Loading profile...</p>
              )}

              {!isLoading && profile && activeTab === "profile" && (
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
              )}

              {!isLoading && activeTab === "inquiries" && <InquiriesTab />}
              {!isLoading && activeTab === "saved" && <SavedPropertiesTab />}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage;
