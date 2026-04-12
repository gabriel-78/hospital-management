import z from "zod";

export const FindDoctorByIdResponseSchema = z.object({
  id: z.string(),
});

export type FindDoctorByIdResponse = z.infer<
  typeof FindDoctorByIdResponseSchema
>;
