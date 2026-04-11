import { z } from 'zod';

export const updatePatientInputSchema = z
  .object({
    name: z.string().min(2).max(255).optional(),
  })
  .refine((data) => data.name !== undefined, {
    message: 'At least one field must be provided',
  });

export type UpdatePatientInput = z.infer<typeof updatePatientInputSchema>;
