import { ApiProperty } from "./property";

export interface InterestSubmission {
  propertyId: string;
  investmentAmount: number;
  fractions: number;
  email: string;
}

/**
 * Data passed via react-router `navigate(..., { state })`
 * UI-friendly but still rich.
 */
export interface InterestSuccessData {
  property: ApiProperty; // ✅ FULL property object
  email: string;
}


// Add to your types file or create a new one
export type NonAuthenticatedInterest = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  property_id: number;
  property_title?: string;
  created_at: string;
  status?: string; // Optional if you want to track status
};