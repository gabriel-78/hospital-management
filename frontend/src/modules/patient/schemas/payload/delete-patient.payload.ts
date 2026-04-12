import z from "zod";

export const DeletePatientPayloadSchema = z.object({
  id: z.string(),
});

export type DeletePatientPayload = z.infer<typeof DeletePatientPayloadSchema>;
