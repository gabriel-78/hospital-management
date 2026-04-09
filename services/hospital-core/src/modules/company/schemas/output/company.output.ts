import { z } from 'zod';

const addressOutputSchema = z.object({
  street: z.string(),
  number: z.string(),
  complement: z.string().optional(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
});

export const companyOutputSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  cnpj: z.string(),
  type: z.enum(['HOSPITAL', 'CLINIC']),
  address: addressOutputSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type CompanyOutput = z.infer<typeof companyOutputSchema>;
