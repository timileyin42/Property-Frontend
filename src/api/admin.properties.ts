import { api } from "./axios";
import { ApiProperty } from "../types/property";

export interface AdminPropertyListResponse {
  properties: ApiProperty[];
  total: number;
  page: number;
  page_size: number;
}

export type PropertyStatusFilter = "AVAILABLE" | "SOLD";

export interface UpdateAdminPropertyPayload {
  title?: string;
  location?: string;
  description?: string;
  status?: PropertyStatusFilter;
  image_urls?: string[];
  primary_image?: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  expected_roi?: number;
  total_fractions?: number;
  fraction_price?: number;
  project_value?: number;
}

export const fetchAdminProperties = async (params?: {
  page?: number;
  page_size?: number;
  status?: PropertyStatusFilter;
}): Promise<AdminPropertyListResponse> => {
  const res = await api.get("/admin/properties", { params });
  return res.data;
};

export const updateAdminProperty = async (
  propertyId: number,
  payload: UpdateAdminPropertyPayload
): Promise<ApiProperty> => {
  const res = await api.patch(`/admin/properties/${propertyId}`, payload);
  return res.data;
};
