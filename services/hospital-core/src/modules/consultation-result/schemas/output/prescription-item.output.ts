import { z } from 'zod';

export const prescriptionItemOutputSchema = z.object({
  id: z.string().uuid(),
  prescriptionId: z.string().uuid(),
  remedyId: z.string().uuid().nullable(),
  medication: z.string(),
  dosage: z.string(),
  duration: z.string(),
  instructions: z.string().nullable(),
});

export type PrescriptionItemOutput = z.infer<typeof prescriptionItemOutputSchema>;
