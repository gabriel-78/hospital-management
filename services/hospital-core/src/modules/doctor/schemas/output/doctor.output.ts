import { z } from 'zod';

export const doctorOutputSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  crm: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type DoctorOutput = z.infer<typeof doctorOutputSchema>;
