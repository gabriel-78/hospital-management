import z from "zod";

export const UpdatePatientPayloadSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type UpdatePatientPayload = z.infer<typeof UpdatePatientPayloadSchema>;
