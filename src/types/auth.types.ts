export interface SignupPayload {
  email: string;
  phone: string;
  password: string;
}

export interface SigninPayload {
  username: string;
  password: string;
  rememberMe?: boolean;
}


export type Role = "ADMIN" | "INVESTOR" | "USER";

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  is_verified: boolean;
  created_at: string;
  role: Role;
  
}
