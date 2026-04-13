import { z } from 'zod';

const prescriptionItemInputSchema = z.object({
  medication: z.string().min(1),
  dosage: z.string().min(1),
  duration: z.string().min(1),
  instructions: z.string().optional(),
});

const prescriptionInputSchema = z.object({
  items: z.array(prescriptionItemInputSchema).min(1),
});

export const createConsultationResultInputSchema = z.object({
  id: z.string().uuid().optional(),
  consultationId: z.string().uuid(),
  doctorId: z.string().uuid(),
  description: z.string().min(1),
  prescription: prescriptionInputSchema.optional(),
});

export type CreateConsultationResultInput = z.infer<typeof createConsultationResultInputSchema>;
