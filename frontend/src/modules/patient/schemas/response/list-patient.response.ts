import z from "zod";

export const PatientResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export const ListPatientResponseSchema = z.array(PatientResponseSchema);

export type PatientResponse = z.infer<typeof PatientResponseSchema>;
export type ListPatientResponse = z.infer<typeof ListPatientResponseSchema>;
