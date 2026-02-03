import { api } from "./axios";
import type { UpdateItem } from "../types/updates";

export interface AdminUpdatePayload {
  property_id?: number | null;
  title: string;
  content: string;
  media_files?: Array<{
    media_type: "image" | "video";
    url: string;
  }>;
  image_url?: string;
  video_url?: string;
}

export const createAdminUpdate = async (payload: AdminUpdatePayload) => {
  const res = await api.post<UpdateItem>("/admin/updates", payload);
  return res.data;
};

export const updateAdminUpdate = async (updateId: number, payload: AdminUpdatePayload) => {
  const res = await api.patch<UpdateItem>(`/admin/updates/${updateId}`, payload);
  return res.data;
};
