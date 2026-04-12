import z from "zod";

export const CompleteConsultationPayloadSchema = z.object({
  id: z.string(),
});

export type CompleteConsultationPayload = z.infer<typeof CompleteConsultationPayloadSchema>;
