import { z } from 'zod';

export const updateDoctorInputSchema = z
  .object({
    name: z.string().min(2).max(255).optional(),
    crm: z
      .string()
      .regex(/^\d{4,6}-[A-Za-z]{2}$/, 'CRM must follow the format NNNNNN-UF')
      .optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'At least one field must be provided',
  });

export type UpdateDoctorInput = z.infer<typeof updateDoctorInputSchema>;
