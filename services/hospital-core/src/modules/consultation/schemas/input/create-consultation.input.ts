import { z } from 'zod';

export const createConsultationInputSchema = z.object({
  doctorId: z.string().uuid(),
  patientId: z.string().uuid(),
  scheduledAt: z.coerce.date(),
});

export type CreateConsultationInput = z.infer<typeof createConsultationInputSchema>;
