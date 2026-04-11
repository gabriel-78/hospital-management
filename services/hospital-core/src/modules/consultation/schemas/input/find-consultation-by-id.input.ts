import { z } from 'zod';

export const findConsultationByIdInputSchema = z.object({
  id: z.string().uuid(),
});

export type FindConsultationByIdInput = z.infer<typeof findConsultationByIdInputSchema>;
