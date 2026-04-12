import z from "zod";

export const CancelConsultationPayloadSchema = z.object({
  id: z.string(),
});

export type CancelConsultationPayload = z.infer<typeof CancelConsultationPayloadSchema>;
