import z from "zod";

export const FindPatientByIdPayloadSchema = z.object({
  id: z.string(),
});

export type FindPatientByIdPayload = z.infer<
  typeof FindPatientByIdPayloadSchema
>;
