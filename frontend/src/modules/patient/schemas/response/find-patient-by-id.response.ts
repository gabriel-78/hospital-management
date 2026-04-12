import z from "zod";

export const FindPatientByIdResponseSchema = z.object({
  id: z.string(),
});

export type FindPatientByIdResponse = z.infer<
  typeof FindPatientByIdResponseSchema
>;
