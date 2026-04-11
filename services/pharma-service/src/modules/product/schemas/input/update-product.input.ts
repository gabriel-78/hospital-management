import { z } from 'zod';

export const updateProductInputSchema = z
  .object({
    name: z.string().min(2).max(255).optional(),
    category: z.string().min(1).max(100).optional(),
    activeIngredient: z.string().min(1).max(255).optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'At least one field must be provided',
  });

export type UpdateProductInput = z.infer<typeof updateProductInputSchema>;
