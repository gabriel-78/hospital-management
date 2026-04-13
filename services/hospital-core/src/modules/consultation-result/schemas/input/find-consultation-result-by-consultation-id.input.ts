import { z } from 'zod';

export const findConsultationResultByConsultationIdInputSchema = z.object({
  consultationId: z.string().uuid(),
});

export type FindConsultationResultByConsultationIdInput = z.infer<
  typeof findConsultationResultByConsultationIdInputSchema
>;
