
export type UserRole = "PUBLIC" | "INVESTOR" | "ADMIN" | "PROPERTY_OWNER";


export interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  created_at: string; // ISO string
  updated_at: string; // ISO string
}

// src/types/user.ts



export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}


export interface UsersResponse {
  users: AdminUser[];
}
// src/types/user.ts

export interface UserProfileResponse {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}



