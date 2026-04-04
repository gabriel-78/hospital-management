import { z } from 'zod';

export const findCompanyByIdInputSchema = z.object({
  id: z.string().uuid(),
});

export type FindCompanyByIdInput = z.infer<typeof findCompanyByIdInputSchema>;
