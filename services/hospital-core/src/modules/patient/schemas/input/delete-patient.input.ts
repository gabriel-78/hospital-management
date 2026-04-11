import { z } from 'zod';

export const deletePatientInputSchema = z.object({
  id: z.string().uuid(),
});

export type DeletePatientInput = z.infer<typeof deletePatientInputSchema>;
