import { api } from "./axios";
import type { UpdateCommentResponse, UpdateItem, UpdateListResponse } from "../types/updates";

export const fetchUpdates = async (params?: {
  page?: number;
  page_size?: number;
}): Promise<UpdateListResponse> => {
  const res = await api.get("/updates", { params });
  return res.data;
};

export const fetchUpdateDetail = async (updateId: number): Promise<UpdateItem> => {
  const res = await api.get(`/updates/${updateId}`);
  return res.data;
};

export const fetchPublicUpdateComments = async (
  updateId: number,
  params?: { page?: number; page_size?: number }
): Promise<UpdateCommentResponse> => {
  const res = await api.get(`/updates/${updateId}/comments`, { params });
  return res.data;
};

export const fetchUserUpdateComments = async (
  updateId: number,
  params?: { page?: number; page_size?: number }
): Promise<UpdateCommentResponse> => {
  const res = await api.get(`/user/updates/${updateId}/comments`, { params });
  return res.data;
};

export const postUserUpdateComment = async (updateId: number, content: string) => {
  const res = await api.post(`/user/updates/${updateId}/comments`, { content });
  return res.data;
};

export const deleteUserUpdateComment = async (commentId: number) => {
  const res = await api.delete(`/user/updates/comments/${commentId}`);
  return res.data;
};

export const toggleUpdateLike = async (updateId: number) => {
  const res = await api.post(`/user/updates/${updateId}/like`);
  return res.data;
};

export const fetchAdminUpdateComments = async (
  updateId: number,
  params?: { page?: number; page_size?: number }
): Promise<UpdateCommentResponse> => {
  const res = await api.get(`/admin/updates/${updateId}/comments`, { params });
  return res.data;
};

export const deleteAdminUpdateComment = async (commentId: number) => {
  const res = await api.delete(`/admin/updates/comments/${commentId}`);
  return res.data;
};
