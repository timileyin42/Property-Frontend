
// types/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "INVESTOR";
  status: "ACTIVE" | "DEACTIVATED";
  created_at: string;
}


export interface Investment {
  id: number;
  user_id: number;
  property_id: number;
  fractions_owned: number;
  initial_value: number;
  current_value: number;
  ownership_percentage: number;
  growth_percentage: number;
  growth_amount: number;
  image_url: string;
  created_at: string;
  updated_at: string;
  property_title: string;
  property_location: string;
}

export interface InvestmentResponse {
  investments: Investment[];
  total: number;
  total_initial_value: number;
  total_current_value: number;
  total_growth_percentage: number;
}
export interface InvestmentFilters {
  search: string;
  sortBy: "date" | "name";
  status?: "growing" | "declining";
}





export type InterestStatus = "NEW" | "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "SOLD" | "AVAILABLE" | "CONTACTED" | "CLOSED";

export interface InvestorInterest {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  property_id: number;
  property_title: string;
  fractions?: number;
  investment_amount?: number;
  status: InterestStatus;
  contacted_at: string | null;
  assigned_admin_id: number | null;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
}
