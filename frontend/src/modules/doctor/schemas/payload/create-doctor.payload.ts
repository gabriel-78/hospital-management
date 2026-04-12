import z from "zod";

export const CreateDoctorPayloadSchema = z.object({
  name: z.string(),
  crm: z.string(),
});

export type CreateDoctorPayload = z.infer<typeof CreateDoctorPayloadSchema>;
