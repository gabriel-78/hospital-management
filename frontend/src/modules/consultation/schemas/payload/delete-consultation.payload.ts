import z from "zod";

export const DeleteConsultationPayloadSchema = z.object({
  id: z.string(),
});

export type DeleteConsultationPayload = z.infer<typeof DeleteConsultationPayloadSchema>;
