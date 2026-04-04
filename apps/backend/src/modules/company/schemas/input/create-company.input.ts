import { z } from 'zod';

const addressSchema = z.object({
  street: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional(),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2),
  zipCode: z.string().regex(/^\d{8}$/, 'zipCode must be exactly 8 digits'),
});

export const createCompanyInputSchema = z.object({
  name: z.string().min(2).max(255),
  cnpj: z.string().regex(/^\d{14}$/, 'cnpj must be exactly 14 digits'),
  type: z.enum(['HOSPITAL', 'CLINIC']),
  address: addressSchema,
});

export type CreateCompanyInput = z.infer<typeof createCompanyInputSchema>;
