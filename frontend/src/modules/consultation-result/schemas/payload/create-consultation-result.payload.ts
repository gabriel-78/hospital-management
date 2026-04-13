import z from "zod";

const PrescriptionItemPayloadSchema = z.object({
  remedyId: z.string().uuid().optional(),
  medication: z.string().min(1),
  dosage: z.string().min(1),
  duration: z.string().min(1),
  instructions: z.string().optional(),
});

export const CreateConsultationResultPayloadSchema = z.object({
  consultationId: z.string().uuid(),
  doctorId: z.string().uuid(),
  description: z.string().min(1),
  prescription: z
    .object({
      items: z.array(PrescriptionItemPayloadSchema).min(1),
    })
    .optional(),
});

export type CreateConsultationResultPayload = z.infer<
  typeof CreateConsultationResultPayloadSchema
>;
