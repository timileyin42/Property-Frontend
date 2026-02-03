import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(8, "Phone number is required"),
  message: z.string().min(5, "Message is required"),
  property_id: z.number(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
