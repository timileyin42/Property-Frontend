// services/property.service.ts
import { api } from "../api/axios";
import { ApiProperty } from "../types/property";



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