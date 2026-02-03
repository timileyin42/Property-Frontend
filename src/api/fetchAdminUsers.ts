import {api} from "./axios";
import { UsersResponse } from "../types/user";
import axios from "axios";

export const fetchAdminUsers = async (): Promise<UsersResponse> => {
  try {
    const res = await api.get<UsersResponse>("/admin/users");
    console.log("resposnse coming from the service");
    console.log(res);
    return res.data;
  } catch (error: unknown) {
    // Axios-specific error handling
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.statusText ||
        "Failed to fetch users";

      throw new Error(message);
    }

    // Non-Axios / unexpected error
    throw new Error("Something went wrong. Please try again.");
  }
};
