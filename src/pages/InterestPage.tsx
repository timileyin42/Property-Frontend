import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { InterestTable } from "../components/admincomponents/InterestTable";
import { NonAuthInterestTable } from "./nonauthuser/NonAuthInterestTable"; // You'll create this
import { InterestCard } from "../components/admincomponents/InterestCard";
import { NonAuthInterestCard } from "./nonauthuser/NonAuthInterestCard"; // You'll create this
import { InvestorInterest} from "../types/investment";
import {NonAuthenticatedInterest } from "../types/interest"
import { fetchInvestorInterests, fetchNonAuthenticatedInterests } from "../api/admin.interests";

type StatusFilter = "ALL" | "NEW" | "PENDING" | "APPROVED" | "REJECTED" | "AVAILABLE" | "ACTIVE" | "CONTACTED";
type UserTypeFilter = "authenticated" | "nonAuthenticated";

export const InterestPage: React.FC = () => {
  const [authenticatedData, setAuthenticatedData] = useState<InvestorInterest[]>([]);
  const [nonAuthenticatedData, setNonAuthenticatedData] = useState<NonAuthenticatedInterest[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [userTypeFilter, setUserTypeFilter] = useState<UserTypeFilter>("authenticated");
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Fetch data
  // -----------------------------
  useEffect(() => {
    const loadAllInterests = async () => {
      try {
        setLoading(true);
        
        // Fetch both types of data in parallel
    const [authRes, nonAuthRes] = await Promise.all([
  fetchInvestorInterests(),
  fetchNonAuthenticatedInterests()
]);

const typedAuthData = Array.isArray(authRes) 
  ? (authRes as InvestorInterest[]) 
  : [];

const typedNonAuthData = Array.isArray(nonAuthRes)
  ? (nonAuthRes as NonAuthenticatedInterest[])
  : [];


        setAuthenticatedData(typedAuthData);
        setNonAuthenticatedData(typedNonAuthData);
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to load interests");
      } finally {
        setLoading(false);
      }
    };

    loadAllInterests();

  }, []);

console.log("nonAuthRes");
console.log(nonAuthenticatedData);
console.log("nonAuthRes");
  // -----------------------------
  // Filter authenticated data
  // -----------------------------
  const filteredAuthenticatedData = useMemo(() => {
    const q = search.trim().toLowerCase();

    return authenticatedData.filter((item) => {
      const name = item.name?.toLowerCase() ?? "";
      const property = item.property_title?.toLowerCase() ?? "";
      const status = item.status?.toUpperCase() ?? "";

      const matchesSearch =
        q === "" || name.includes(q) || property.includes(q);

      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [authenticatedData, search, statusFilter]);

  // -----------------------------
  // Filter non-authenticated data
  // -----------------------------

  const filteredNonAuthenticatedData = useMemo(() => {
    const q = search.trim().toLowerCase();

    return nonAuthenticatedData.filter((item) => {
      const name = item.name?.toLowerCase() ?? "";
      const email = item.email?.toLowerCase() ?? "";
      const property = item.property_title?.toLowerCase() ?? "";

      const matchesSearch =
        q === "" || name.includes(q) || email.includes(q) || property.includes(q);

      // For non-auth, you might not have status, adjust as needed
      if (statusFilter === "ALL") return matchesSearch;
      
      // If non-auth has status field, filter by it
      const status = item.status?.toUpperCase() ?? "";
      const matchesStatus = status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [nonAuthenticatedData, search, statusFilter]);

  // -----------------------------
  // Get current data based on user type filter
  // -----------------------------
  const currentData = useMemo(() => {
    return userTypeFilter === "authenticated" 
      ? filteredAuthenticatedData 
      : filteredNonAuthenticatedData;
  }, [userTypeFilter, filteredAuthenticatedData, filteredNonAuthenticatedData]);

  if (loading) {
    return (
      <div className="glass-panel rounded-xl p-6">
        <p className="text-sm text-on-surface-variant">Loading interests...</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-6 text-on-surface">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl text-on-surface">Investor Interests</h2>
          <p className="text-sm text-on-surface-variant">
            Review authenticated interests and public inquiries
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap gap-3">
          {/* User Type Filter */}
          <div className="inline-flex rounded-lg border border-[rgba(248,246,241,0.15)] bg-surface-low p-1">
            <button
              type="button"
              onClick={() => setUserTypeFilter("authenticated")}
              className={`px-3 py-1.5 text-sm rounded-md transition ${
                userTypeFilter === "authenticated"
                  ? "bg-premium-gold text-primary-container"
                  : "text-on-surface-variant"
              }`}
            >
              Interests
            </button>
            <button
              type="button"
              onClick={() => setUserTypeFilter("nonAuthenticated")}
              className={`px-3 py-1.5 text-sm rounded-md transition ${
                userTypeFilter === "nonAuthenticated"
                  ? "bg-premium-gold text-primary-container"
                  : "text-on-surface-variant"
              }`}
            >
              Inquiries
            </button>
          </div>

          {/* Search Input */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              userTypeFilter === "authenticated"
                ? "Search by name or property..."
                : "Search by name, email, or property..."
            }
            className="bg-surface-low border border-[rgba(248,246,241,0.15)] rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-premium-gold placeholder:text-on-surface-variant/40"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="bg-surface-low border border-[rgba(248,246,241,0.15)] rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-premium-gold"
          >
            <option value="ALL">All Status</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="NEW">NEW</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="flex gap-4 mb-6 p-4 bg-surface-low rounded-lg border border-[rgba(248,246,241,0.12)]">
        <div className="text-center">
          <div className="data-stat text-lg text-premium-gold">{authenticatedData.length}</div>
          <div className="label-caps text-[10px] text-on-surface-variant mt-1">Interests</div>
        </div>
        <div className="text-center">
          <div className="data-stat text-lg text-secondary">{nonAuthenticatedData.length}</div>
          <div className="label-caps text-[10px] text-on-surface-variant mt-1">Inquiries</div>
        </div>
        <div className="text-center">
          <div className="data-stat text-lg text-on-surface">{authenticatedData.length + nonAuthenticatedData.length}</div>
          <div className="label-caps text-[10px] text-on-surface-variant mt-1">Total</div>
        </div>
      </div>

      {/* Table for Desktop */}
      {userTypeFilter === "authenticated" ? (
        <InterestTable data={filteredAuthenticatedData} />
      ) : (
        <NonAuthInterestTable data={filteredNonAuthenticatedData} />
      )}

      {/* Cards for Mobile */}
      <div className="md:hidden flex flex-col gap-3 mt-4">
        {currentData.length === 0 ? (
          <p className="text-sm text-on-surface-variant text-center">
            No {userTypeFilter === "authenticated" ? "authenticated" : "non-authenticated"} interests found.
          </p>
        ) : userTypeFilter === "authenticated" ? (
          filteredAuthenticatedData.map((interest) => (
            <InterestCard
              key={interest.id}
              interest={interest}
            />
          ))
        ) : (
          filteredNonAuthenticatedData.map((interest) => (
            <NonAuthInterestCard
              key={interest.id}
              interest={interest}
            />
          ))
        )}
      </div>
    </div>
  );
}
