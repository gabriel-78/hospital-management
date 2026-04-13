import { z } from 'zod';
import { prescriptionItemOutputSchema } from './prescription-item.output.js';

export const prescriptionOutputSchema = z.object({
  id: z.string().uuid(),
  consultationResultId: z.string().uuid(),
  createdAt: z.date(),
  deletedAt: z.date().nullable(),
  items: z.array(prescriptionItemOutputSchema),
});

export type PrescriptionOutput = z.infer<typeof prescriptionOutputSchema>;
