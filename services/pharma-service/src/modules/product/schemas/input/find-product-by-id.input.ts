import { z } from 'zod';

export const findProductByIdInputSchema = z.object({
  id: z.string().uuid(),
});

export type FindProductByIdInput = z.infer<typeof findProductByIdInputSchema>;
