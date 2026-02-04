import { api } from "./axios";
import type { InvestmentDetail, InvestmentResponse } from "../types/investment";

export interface PortfolioSummaryResponse {
  total: number;
  total_initial_value: number;
  total_current_value: number;
  total_growth_percentage: number;
  total_fractions_owned?: number;
  properties_count?: number;
  average_growth_percentage?: number;
  trend_labels?: string[];
  trend_values?: number[];
}

export type PortfolioTrendInterval = "monthly" | "weekly";

export interface PortfolioTrendResponse {
  total_current_value: number;
  total_initial_value: number;
  total_growth_percentage: number;
  trend_labels: string[];
  trend_values: number[];
  interval?: PortfolioTrendInterval;
  start_date?: string;
  end_date?: string;
  data_points?: number;
}

export const fetchInvestorInvestments = async (): Promise<InvestmentResponse> => {
  const res = await api.get("/investor/investments");
  return res.data;
};

export const fetchPortfolioSummary = async (): Promise<PortfolioSummaryResponse> => {
  const res = await api.get("/investor/portfolio/summary");
  return res.data;
};

export const fetchPortfolioTrend = async (params?: {
  interval?: PortfolioTrendInterval;
  months?: number;
}): Promise<PortfolioTrendResponse> => {
  const res = await api.get("/investor/portfolio/trend", { params });
  return res.data;
};

export const fetchInvestorInvestmentDetail = async (
  investmentId: number
): Promise<InvestmentDetail> => {
  const res = await api.get(`/investor/investments/${investmentId}`);
  return res.data;
};
