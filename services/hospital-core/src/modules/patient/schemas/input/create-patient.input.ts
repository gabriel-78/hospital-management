import { z } from 'zod';

export const createPatientInputSchema = z.object({
  name: z.string().min(2).max(255),
});

export type CreatePatientInput = z.infer<typeof createPatientInputSchema>;
