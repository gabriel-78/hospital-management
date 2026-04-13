import { z } from 'zod';
import { prescriptionOutputSchema } from './prescription.output.js';

export const consultationResultOutputSchema = z.object({
  id: z.string().uuid(),
  consultationId: z.string().uuid(),
  description: z.string(),
  createdAt: z.date(),
  deletedAt: z.date().nullable(),
  prescription: prescriptionOutputSchema.nullable(),
});

export type ConsultationResultOutput = z.infer<typeof consultationResultOutputSchema>;
