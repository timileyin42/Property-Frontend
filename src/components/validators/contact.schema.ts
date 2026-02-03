// src/validators/contact.schema.ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  message: z.string().min(1, "Message is required"),
  property_id: z.number().min(1, "Property ID is required"),
  // Add these two fields:
  investmentAmount: z.number().min(0, "Investment amount must be positive").optional(),
  fractions: z.number().min(0, "Fractions must be positive").optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;