import { z } from "zod";

export const assignInvestmentSchema = z.object({
  user_id: z.coerce.number().positive(),
  property_id: z.coerce.number().positive(),
  fractions_owned: z.coerce.number().int().positive(),
  initial_value: z.coerce.number().positive(),
  current_value: z.coerce.number().positive(),
  image_url: z.string().min(1, "Image URL is required"),
});

export type AssignInvestmentValues = z.infer<typeof assignInvestmentSchema>;
