import z from "zod";

export const CreateConsultationPayloadSchema = z.object({
  doctorId: z.string().uuid(),
  patientId: z.string().uuid(),
  scheduledAt: z.coerce.date(),
});

export type CreateConsultationPayload = z.infer<typeof CreateConsultationPayloadSchema>;
