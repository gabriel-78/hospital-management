import { z } from 'zod';

export const deleteCompanyInputSchema = z.object({
  id: z.string().uuid(),
});

export type DeleteCompanyInput = z.infer<typeof deleteCompanyInputSchema>;
