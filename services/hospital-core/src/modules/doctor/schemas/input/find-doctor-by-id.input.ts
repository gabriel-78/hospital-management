import { z } from 'zod';

export const findDoctorByIdInputSchema = z.object({
  id: z.string().uuid(),
});

export type FindDoctorByIdInput = z.infer<typeof findDoctorByIdInputSchema>;
