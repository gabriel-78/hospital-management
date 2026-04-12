import z from "zod";

export const CreatePatientPayloadSchema = z.object({
  name: z.string(),
});

export type CreatePatientPayload = z.infer<typeof CreatePatientPayloadSchema>;
