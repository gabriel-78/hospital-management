import z from "zod";

export const FindConsultationByIdPayloadSchema = z.object({
  id: z.string(),
});

export type FindConsultationByIdPayload = z.infer<typeof FindConsultationByIdPayloadSchema>;
