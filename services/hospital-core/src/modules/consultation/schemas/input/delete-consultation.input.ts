import { z } from 'zod';

export const deleteConsultationInputSchema = z.object({
  id: z.string().uuid(),
});

export type DeleteConsultationInput = z.infer<typeof deleteConsultationInputSchema>;
