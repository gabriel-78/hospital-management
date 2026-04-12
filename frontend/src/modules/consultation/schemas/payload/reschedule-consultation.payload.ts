import z from "zod";

export const RescheduleConsultationPayloadSchema = z.object({
  id: z.string(),
  scheduledAt: z.coerce.date(),
});

export type RescheduleConsultationPayload = z.infer<typeof RescheduleConsultationPayloadSchema>;
