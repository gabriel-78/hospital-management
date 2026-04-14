import z from "zod";

export const DoctorResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  crm: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export const ListDoctorResponseSchema = z.array(DoctorResponseSchema);

export type DoctorResponse = z.infer<typeof DoctorResponseSchema>;
export type ListDoctorResponse = z.infer<typeof ListDoctorResponseSchema>;
