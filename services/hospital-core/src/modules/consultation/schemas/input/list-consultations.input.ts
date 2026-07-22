import { z } from 'zod';
import { ConsultationStatusEnum } from '../../consultation.domain.js';

const statusEnum = z.nativeEnum(ConsultationStatusEnum);

export const listConsultationsInputSchema = z.object({
  patientId: z.string().uuid().optional(),
  doctorId: z.string().uuid().optional(),
  status: z.preprocess(
    (val) => (typeof val === 'string' ? [val] : val),
    z.array(statusEnum).optional(),
  ),
});

export type ListConsultationsInput = z.infer<typeof listConsultationsInputSchema>;
