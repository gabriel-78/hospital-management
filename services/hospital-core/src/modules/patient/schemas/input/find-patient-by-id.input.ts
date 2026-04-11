import { z } from 'zod';

export const findPatientByIdInputSchema = z.object({
  id: z.string().uuid(),
});

export type FindPatientByIdInput = z.infer<typeof findPatientByIdInputSchema>;
