export interface ContactRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
  property_id: number;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  inquiry_id: number;
}
