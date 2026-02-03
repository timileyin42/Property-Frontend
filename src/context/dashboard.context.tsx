import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/axios";


interface DashboardContextType {
  stats: PortfolioStat[];
  loading: boolean;
  refresh: () => Promise<void>;
}

// types/dashboard.ts
export interface AdminDashboardStatsResponse {
  total_interests: number;
  active_properties: number;
  total_users: number;
  total_investment: number;
  interests_growth: string;
  properties_growth: string;
  users_growth: string;
  investment_growth: string;
}

export interface PortfolioStat {
  id: number;
  title: string;
  value: number | string;
  description: string;
}


const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [stats, setStats] = useState<PortfolioStat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const { data } = await api.get<AdminDashboardStatsResponse>(
        "/admin/dashboard-stats"
      );

      const formatted: PortfolioStat[] = [
        {
          id: 1,
          title: "Total Interest",
          value: data.total_interests,
          description: data.interests_growth,
        },
        {
          id: 2,
          title: "Active Properties",
          value: data.active_properties,
          description: data.properties_growth,
        },
        {
          id: 3,
          title: "Total Users",
          value: data.total_users,
          description: data.users_growth,
        },
        {
          id: 4,
          title: "Total Investment",
          value: `NGN ${data.total_investment}`,
          description: data.investment_growth,
        },
      ];

      setStats(formatted);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <DashboardContext.Provider
      value={{ stats, loading, refresh: fetchStats }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx)
    throw new Error("useDashboard must be used inside DashboardProvider");
  return ctx;
};
