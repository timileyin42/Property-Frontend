import React from "react";
import { formatDate } from "../../util/formatDate";
import type { User } from "../../types/userProfile";

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
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-premium-gold/5 blur-[60px] -mr-16 -mt-16 pointer-events-none" />
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full border-2 border-premium-gold p-1 flex items-center justify-center bg-primary-container">
              <span className="font-display text-3xl text-premium-gold">{initials}</span>
            </div>
            <div className="absolute bottom-1 right-1 bg-success-emerald text-white p-1 rounded-full border-2 border-background">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>
          </div>
          <h2 className="font-display text-2xl text-on-surface mb-1">{user.full_name}</h2>
          <p className="label-caps text-on-surface-variant mb-6">Investor</p>

          <div className="w-full space-y-4 text-left border-t border-[rgba(248,246,241,0.15)] pt-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-premium-gold">mail</span>
              <div className="min-w-0">
                <p className="label-caps text-[10px] text-on-surface-variant">Email Address</p>
                <p className="text-on-surface truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-premium-gold">call</span>
              <div>
                <p className="label-caps text-[10px] text-on-surface-variant">Phone Number</p>
                <p className="text-on-surface">{user.phone ?? "Not provided"}</p>
              </div>
            </div>
            {location && (
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-premium-gold">location_on</span>
                <div>
                  <p className="label-caps text-[10px] text-on-surface-variant">Location</p>
                  <p className="text-on-surface">{location}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-premium-gold">calendar_today</span>
              <div>
                <p className="label-caps text-[10px] text-on-surface-variant">Joined</p>
                <p className="text-on-surface">{formatDate(user.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KYC trust card */}
      <div className="glass-panel p-6 rounded-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-success-emerald/15 flex items-center justify-center text-success-emerald shrink-0">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            security
          </span>
        </div>
        <div>
          <h4 className="label-caps text-on-surface mb-1">KYC Verification</h4>
          <span className="inline-block text-[10px] label-caps text-success-emerald bg-success-emerald/10 px-2 py-0.5 rounded border border-success-emerald/20">
            Status: Verified
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummaryCard;
