import { z } from 'zod';

export const deleteProductInputSchema = z.object({
  id: z.string().uuid(),
});

export type DeleteProductInput = z.infer<typeof deleteProductInputSchema>;
