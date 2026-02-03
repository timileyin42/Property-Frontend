export interface Property {
  id: number;
  title: string;
  location: string;
  description: string | null;

  bedrooms: number;
  bathrooms: number;
  area_sqft: number;

  project_value: number;
  expected_roi: number;

  is_fractional: boolean;
  total_fractions: number;
  fractions_sold: number;
  fractions_available: number;
  fraction_price: number | null;

  status: "AVAILABLE" | "PENDING" | "ACTIVE";

  primary_image: string;
  image_urls: string[];

  created_at: string;
  updated_at: string;
}
