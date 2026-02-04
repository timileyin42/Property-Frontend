// src/api/axios.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "https://api.elycapfracprop.com/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
  timeout: 15000,
});

/* =====================
   PUBLIC ROUTES
===================== */

const PUBLIC_ROUTES = new Set([
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
]);

/* =====================
   REQUEST INTERCEPTOR
===================== */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      localStorage.getItem("token") ?? sessionStorage.getItem("token");
    const pathname = config.url?.split("?")[0] ?? "";

    if (token && !PUBLIC_ROUTES.has(pathname)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

/* =====================
   RESPONSE INTERCEPTOR
===================== */

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<unknown>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      const currentPath = window.location.pathname;
      if (currentPath !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);
