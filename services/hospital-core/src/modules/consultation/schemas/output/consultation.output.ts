import { z } from 'zod';

export const consultationOutputSchema = z.object({
  id: z.string().uuid(),
  doctorId: z.string().uuid(),
  patientId: z.string().uuid(),
  scheduledAt: z.date(),
  status: z.enum(['SCHEDULED', 'CANCELLED', 'COMPLETED']),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type ConsultationOutput = z.infer<typeof consultationOutputSchema>;
