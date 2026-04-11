import { z } from 'zod';

export const rescheduleConsultationInputSchema = z.object({
  scheduledAt: z.coerce.date(),
});

export type RescheduleConsultationInput = z.infer<typeof rescheduleConsultationInputSchema>;
