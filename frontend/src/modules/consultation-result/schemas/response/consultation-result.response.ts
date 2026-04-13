import z from "zod";

const PrescriptionItemResponseSchema = z.object({
  id: z.string(),
  prescriptionId: z.string(),
  remedyId: z.string().nullable(),
  medication: z.string(),
  dosage: z.string(),
  duration: z.string(),
  instructions: z.string().nullable(),
});

const PrescriptionResponseSchema = z.object({
  id: z.string(),
  consultationResultId: z.string(),
  createdAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
  items: z.array(PrescriptionItemResponseSchema),
});

export const ConsultationResultResponseSchema = z.object({
  id: z.string(),
  consultationId: z.string(),
  description: z.string(),
  createdAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
  prescription: PrescriptionResponseSchema.nullable(),
});

export type PrescriptionItemResponse = z.infer<typeof PrescriptionItemResponseSchema>;
export type PrescriptionResponse = z.infer<typeof PrescriptionResponseSchema>;
export type ConsultationResultResponse = z.infer<typeof ConsultationResultResponseSchema>;
