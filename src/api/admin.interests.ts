// src/api/admin.interests.ts
import axios from "axios";
import { InvestorInterest } from "../types/investment";
//NonAuthenticatedInterest
import {api} from "./axios"
// -----------------------------
// Axios instance (admin-only)
// -----------------------------
const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// -----------------------------
// Attach auth token automatically
// -----------------------------
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ✅ single source of truth

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// -----------------------------
// API functions
// -----------------------------
// FETCHING AUTHENTICATED USERS INTERESTS IN A PROPERTY
export const fetchInvestorInterests = async (): Promise<InvestorInterest[]> => {
  const res = await api.get("/admin/inquiries");
  // console.log(res);
  // console.log("ADMIN INQUIRIES RESPONSE:", res.data);

  const interests = res?.data?.inquiries;

  if (!Array.isArray(interests)) {
    console.warn("Unexpected interests response:", res.data);
    return [];
  }

  return interests;
};

// FETCHING NON-AUTHENTICATED USERS INTEREST IN A PROPERTY DATA
// api/admin.interests.ts or new file


export const fetchNonAuthenticatedInterests = async () => {
  const response = await api.get("/admin/interests");
  const interests = response?.data?.inquiries;

  console.log("NonAuth API Response:", response.data.inquiries);

  return interests; // ✅ actual list
};


// Update interest function
export const updateInvestorInterest = async (
  interestId: number,
  data: {
    status: string;
    assigned_admin_id?: number;
    notes?: string;
  }
) => {
  console.log(interestId);
  console.log(data);
  const response = await api.patch(`/admin/inquiries/${interestId}`, data);
  return response.data;
};




// Optional: Add update function if needed
export const updateNonAuthenticatedContact = async (
  contactId: number,
  data: Partial<{
    status: string;
    notes?: string;
  }>
) => {
  const response = await api.put(`/contact/${contactId}`, data);
  return response.data;
};



export const updateInterest = async (
  interestId: number,
  data: {
    status: string;
    assigned_admin_id?: number;
    notes?: string;
  }
) => {
  const response = await api.put(`/admin/interests/${interestId}`, data);
  return response.data;
};

// export const approveInterest = async (id: number): Promise<void> => {
//   await adminApi.patch(`/admin/interests/${id}`);
// };

// export const rejectInterest = async (id: number): Promise<void> => {
//   await adminApi.patch(`/admin/interests/${id}`);
// };

// export const deleteInterest = async (id: number): Promise<void> => {
//   await adminApi.delete(`/admin/interests/${id}`);
// };





// import { api } from "../api/axios";
// import {  InvestorInterest } from "../types/user";



// export const fetchInvestorInterests = async (): Promise<InvestorInterest[]> => {
//   const { data } = await api.get("/admin/interests");
//   return data.interests;
// };

// export const approveInterest = async (id: number) => {
//   await api.patch(`/admin/interests/${id}/approve`);
// };

// export const rejectInterest = async (id: number) => {
//   await api.patch(`/admin/interests/${id}/reject`);
// };

// export const deleteInterest = async (id: number) => {
//   await api.delete(`/admin/interests/${id}`);
// };