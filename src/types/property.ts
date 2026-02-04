// types/property.ts
import {InterestStatus} from "./investment"
// export type PropertyStatus = "NEW" | "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "SOLD" | "AVAILABLE";


export interface Property {
  id: string;
  title: string;
  location: string;
  project_Value: number;
  total_fractions: number;
  created_at: string;
  status: InterestStatus;
  growth: string;
  value: string;
  roi: string;
  img: string;
}

// src/types/property.ts


export interface ApiProperty {
  id: number;
  title: string;
  location: string;
  description: string;
  status: InterestStatus;

  image_urls: string[];
  primary_image: string;
  media_urls?: string[];
  media_files?: Array<{ url: string }>;
  image_url?: string;

  bedrooms: number;
  bathrooms: number;
  area_sqft: number;

  expected_roi: number;
  total_fractions: number;
  fraction_price: number;
  project_value: number;

  fractions_sold: number;
  fractions_available: number;
  is_fractional: boolean;

  created_at: string;
  updated_at: string;
}

export interface PropertiesResponse {
  properties: ApiProperty[];
  total: number;
  page: number;
  page_size: number;
}
