import { z } from "zod";

export const adminUserUpdateSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  is_active: z.boolean(),
});

export type AdminUserUpdateValues = z.infer<typeof adminUserUpdateSchema>;
