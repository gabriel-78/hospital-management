import { z } from 'zod';

export const pharmaProductOutputSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  category: z.string(),
  activeIngredient: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type PharmaProductOutput = z.infer<typeof pharmaProductOutputSchema>;
