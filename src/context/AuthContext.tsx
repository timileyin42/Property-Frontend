import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../api/axios";
import { SignupPayload, SigninPayload, User } from "../types/auth.types";


interface AuthContextType {
  user: User | null;
  access_token: string | null;
  isAuthenticated: boolean;
  loading: boolean;

  signup: (payload: SignupPayload) => Promise<void>;
  signin: (payload: SigninPayload) => Promise<void>;

  verifyEmail: (payload: { email: string; code: string }) => Promise<{
    access_token?: string;
    refresh_token?: string;
  }>;

   forgotPassword: (payload: { email: string }) => Promise<{ message: string }>;

  resetPassword: (payload: {
    email: string;
    reset_code: string;
    new_password: string;
  }) => Promise<{ message: string }>;
   confirmResetPassword: (payload: { 
    email: string;
    reset_code: string;
    new_password: string;
  }) => Promise<{ message: string }>;
  // ✅ Add this line:
  resendOtp: (payload: { email: string }) => Promise<{ message: string }>;
  

  logout: () => void;
}
// export type Role = "ADMIN" | "INVESTOR" | "USER";


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [access_token, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  }, []);

  const fetchUser = useCallback(async (token: string) => {
    try {
      const { data } = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // 🔁 Restore auth on app load
  useEffect(() => {
    const token =
      localStorage.getItem("token") ?? sessionStorage.getItem("token");

    if (token) {
      setAccessToken(token);
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  const signin = async (payload: SigninPayload) => {
    const formData = new URLSearchParams();
    formData.append("username", payload.username);
    formData.append("password", payload.password);

    const { data } = await api.post("/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const token: string = data.access_token;

    if (payload.rememberMe) {
      localStorage.setItem("token", token);
      sessionStorage.removeItem("token");
    } else {
      sessionStorage.setItem("token", token);
      localStorage.removeItem("token");
    }
    setAccessToken(token);

    await fetchUser(token);
  };
  // SIGNUP
  const signup = async (payload: SignupPayload) => {
  const { data } = await api.post("/auth/signup", payload);
  setUser(data.user);
  setAccessToken(data.access_token);
  localStorage.setItem("token", data.access_token);
};


  // verify email api endpoint
  const verifyEmail = async (payload: { email: string; code: string }) => {
    const { data } = await api.post<{ access_token?: string; refresh_token?: string }>("/auth/verify-email", {
      email: payload.email,
      otp_code: payload.code,
    });

    if (data?.access_token) {
      localStorage.setItem("token", data.access_token);
      sessionStorage.removeItem("token");
      setAccessToken(data.access_token);
      await fetchUser(data.access_token);
    }
    return data ?? {};
  };

// resend otp 
  // const resendOtp = async (payload: { email: string }) => {
  //   await api.post("/auth/resend-otp", payload);
  // };
const resendOtp = async (payload: { email: string }) => {
  const { data } = await api.post<{ message: string }>("/auth/resend-otp", payload);
  return data;
};

// reset password
// const resetPassword = async (payload: {
//   email: string;
//   reset_code: string;
//   new_password: string;
// }): Promise<void> => {
//   await api.post("/auth/reset-password", payload);
// };

// reset password {ENTER YOUR EMAIL TO SEND OTP}

const forgotPassword = async (payload: { email: string }) => {
  const { data } = await api.post<{ message: string }>(
    "/auth/forgot-password",
    { email: payload.email }
  );
  return data;
};




const resetPassword = async (payload: {
    email: string;
    reset_code: string;
    new_password: string;
  }) => {
    const { data } = await api.post<{ message: string }>("/auth/forgot-password", payload);
    return data;
  };



// CHANGE PASSWORD
const confirmResetPassword = async (payload: { 
  email: string; 
  reset_code: string; 
  new_password: string;
}) => {
    const { data } = await api.post<{ message: string }>("/auth/reset-password", payload);
    return data;
};


  return (
    <AuthContext.Provider
      value={{
        user,
        access_token,
        isAuthenticated: !!user,
        loading,
        signup,
        signin,
        verifyEmail,
        resendOtp,
        resetPassword,
        forgotPassword,
        confirmResetPassword,
        logout,
        
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
