export type InterestStatus = "NEW" | "CONTACTED"  | "CLOSED" | "PENDING" | "ACTIVE";

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