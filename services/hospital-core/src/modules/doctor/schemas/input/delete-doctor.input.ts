import { z } from 'zod';

export const deleteDoctorInputSchema = z.object({
  id: z.string().uuid(),
});

export type DeleteDoctorInput = z.infer<typeof deleteDoctorInputSchema>;
