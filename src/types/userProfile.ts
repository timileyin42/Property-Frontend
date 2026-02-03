export type UserRole = "USER" | "INVESTOR" | "ADMIN";
export type InquiryStatus = "NEW" | "CONTACTED" | "CLOSED";

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdatePayload {
  full_name?: string;
  phone?: string;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  property_id: number | null;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
  property_title?: string;
  assigned_admin_name?: string;
}

export interface InquiryListResponse {
  inquiries: Inquiry[];
  total: number;
  new_count: number;
  contacted_count: number;
  closed_count: number;
}

export interface WishlistItem {
  id: number;
  user_id: number;
  property_id: number;
  notify_on_update: boolean;
  notify_on_price_change: boolean;
  created_at: string;
  property_title?: string;
  property_location?: string;
  property_status?: string;
  property_image?: string;
}

export interface WishlistListResponse {
  items: WishlistItem[];
  total: number;
}
