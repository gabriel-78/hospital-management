import { z } from 'zod';

export const createDoctorInputSchema = z.object({
  name: z.string().min(2).max(255),
  crm: z.string().regex(/^\d{4,6}-[A-Za-z]{2}$/, 'CRM must follow the format NNNNNN-UF'),
});

export type CreateDoctorInput = z.infer<typeof createDoctorInputSchema>;
