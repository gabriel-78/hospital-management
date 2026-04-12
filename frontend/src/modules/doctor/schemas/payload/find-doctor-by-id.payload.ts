import z from "zod";

export const FindDoctorByIdPayloadSchema = z.object({
  id: z.string(),
});

export type FindDoctorByIdPayload = z.infer<typeof FindDoctorByIdPayloadSchema>;
