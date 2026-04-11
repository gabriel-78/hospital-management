import { z } from 'zod';

export const patientOutputSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type PatientOutput = z.infer<typeof patientOutputSchema>;
