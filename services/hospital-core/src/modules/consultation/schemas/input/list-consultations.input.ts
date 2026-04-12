import { z } from 'zod';

const statusEnum = z.enum(['SCHEDULED', 'CANCELLED', 'COMPLETED']);

export const listConsultationsInputSchema = z.object({
  patientId: z.string().uuid().optional(),
  status: z.preprocess(
    (val) => (typeof val === 'string' ? [val] : val),
    z.array(statusEnum).optional(),
  ),
});

export type ListConsultationsInput = z.infer<typeof listConsultationsInputSchema>;
