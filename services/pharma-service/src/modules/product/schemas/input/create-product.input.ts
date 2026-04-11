import { z } from 'zod';

export const createProductInputSchema = z.object({
  name: z.string().min(2).max(255),
  category: z.string().min(1).max(100),
  activeIngredient: z.string().min(1).max(255),
});

export type CreateProductInput = z.infer<typeof createProductInputSchema>;
