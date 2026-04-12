import z from "zod";

export const ConsultationResponseSchema = z.object({
  id: z.string(),
  doctorId: z.string(),
  patientId: z.string(),
  scheduledAt: z.coerce.date(),
  status: z.enum(["SCHEDULED", "CANCELLED", "COMPLETED"]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export type ConsultationResponse = z.infer<typeof ConsultationResponseSchema>;
