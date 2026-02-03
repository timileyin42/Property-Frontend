import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email address"),

    reset_code: z.string().length(6, "Reset code must be 6 digits"),

    new_password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[a-z]/, "At least one lowercase letter")
      .regex(/[A-Z]/, "At least one uppercase letter")
      .regex(/[0-9]/, "At least one number")
      .regex(/[@$!%*?&#]/, "At least one special character"),

    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
