// services/property.service.ts
import { api } from "../api/axios";
import { ApiProperty, PropertiesResponse } from "../types/property";



export const fetchProperties = async (): Promise<ApiProperty[]> => {
  try {
    const res = await api.get("/properties");
    return res.data.properties;
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return []; // ✅ ALWAYS return an array
  }
};


// services/property.service.ts - Add new endpoint
export const fetchFeaturedProperties = async (limit: number = 3): Promise<ApiProperty[]> => {
  try {
    const res = await api.get("/properties", {
      params: { 
        limit, 
        sort: "trending", // sorting
        cache: true // If your API supports cache headers
      }
    });
    return res.data.properties.slice(0, limit);
  } catch (error) {
    console.error("Failed to fetch featured properties:", error);
    return [];
  }
};

export type PropertySearchStatus = "AVAILABLE" | "SOLD" | "INVESTED";

export interface PropertySearchParams {
  location?: string;
  bedrooms?: number;
  status?: PropertySearchStatus;
  min_price?: number;
  max_price?: number;
  page?: number;
  page_size?: number;
}

export const searchPublicProperties = async (
  params: PropertySearchParams
): Promise<PropertiesResponse> => {
  try {
    const res = await api.get("/properties/search", {
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Failed to search properties:", error);
    return {
      properties: [],
      total: 0,
      page: params.page ?? 1,
      page_size: params.page_size ?? 10,
    };
  }
};