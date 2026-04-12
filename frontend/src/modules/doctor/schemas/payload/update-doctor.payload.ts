import z from "zod";

export const UpdateDoctorPayloadSchema = z.object({
  id: z.string(),
  name: z.string(),
  crm: z.string(),
});

export type UpdateDoctorPayload = z.infer<typeof UpdateDoctorPayloadSchema>;
