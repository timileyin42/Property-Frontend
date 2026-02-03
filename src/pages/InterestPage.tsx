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
      } catch (err: any) {
        toast.error(err?.message || "Failed to load interests");
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
      <div className="bg-white rounded-xl p-6">
        <p className="text-sm text-gray-500">Loading interests...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold">Interest Received</h2>
          <p className="text-sm text-gray-500">
            Manage investor interest in properties
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap gap-3">
          {/* User Type Filter */}
          <select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value as UserTypeFilter)}
            className="bg-gray-100 rounded-lg px-3 py-2 text-sm"
          >
            <option value="authenticated">Authenticated Users</option>
            <option value="nonAuthenticated">Non-Authenticated Users</option>
          </select>

          {/* Search Input */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              userTypeFilter === "authenticated" 
                ? "Search by name or property..." 
                : "Search by name, email, or property..."
            }
            className="bg-gray-100 rounded-lg px-3 py-2 text-sm"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="bg-gray-100 rounded-lg px-3 py-2 text-sm"
          >
            <option value="ALL">All Status</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="NEW">NEW</option>
            <option value="CLOSED">CLOSED</option>
            {/* Add more status options as needed */}
          </select>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-semibold">{authenticatedData.length}</div>
          <div className="text-sm text-gray-500">Authenticated</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">{nonAuthenticatedData.length}</div>
          <div className="text-sm text-gray-500">Non-Authenticated</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">{authenticatedData.length + nonAuthenticatedData.length}</div>
          <div className="text-sm text-gray-500">Total Interests</div>
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
          <p className="text-sm text-gray-500 text-center">
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