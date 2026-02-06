// services/property.service.ts
import { api } from "../api/axios";
import { ApiProperty, PropertiesResponse } from "../types/property";

const normalizePropertiesPayload = (
  payload: unknown,
  page: number,
  pageSize: number
): PropertiesResponse => {
  if (Array.isArray(payload)) {
    return {
      properties: payload,
      total: payload.length,
      page,
      page_size: pageSize || payload.length,
    };
  }

  if (payload && typeof payload === "object") {
    const record = payload as {
      properties?: ApiProperty[];
      total?: number;
      page?: number;
      page_size?: number;
      data?: unknown;
    };

    if (Array.isArray(record.properties)) {
      return {
        properties: record.properties,
        total: record.total ?? record.properties.length,
        page: record.page ?? page,
        page_size: record.page_size ?? pageSize,
      };
    }

    const nested = record.data as
      | { properties?: ApiProperty[]; total?: number; page?: number; page_size?: number }
      | ApiProperty[]
      | undefined;

    if (Array.isArray(nested)) {
      return {
        properties: nested,
        total: nested.length,
        page,
        page_size: pageSize || nested.length,
      };
    }

    if (nested && Array.isArray(nested.properties)) {
      return {
        properties: nested.properties,
        total: nested.total ?? nested.properties.length,
        page: nested.page ?? page,
        page_size: nested.page_size ?? pageSize,
      };
    }
  }

  return {
    properties: [],
    total: 0,
    page,
    page_size: pageSize,
  };
};



export const fetchProperties = async (): Promise<ApiProperty[]> => {
  try {
    const res = await api.get("/properties");
    return normalizePropertiesPayload(res.data, 1, 50).properties;
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
    const normalized = normalizePropertiesPayload(res.data, 1, limit).properties;
    return normalized.slice(0, limit);
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
    const res = await api.get("/properties", {
      params,
    });
    return normalizePropertiesPayload(
      res.data,
      params.page ?? 1,
      params.page_size ?? 10
    );
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