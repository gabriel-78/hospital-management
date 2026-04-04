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

export const updateCompanyInputSchema = z
  .object({
    name: z.string().min(2).max(255).optional(),
    address: addressSchema.optional(),
  })
  .refine((data) => data.name !== undefined || data.address !== undefined, {
    message: 'at least one field (name or address) must be provided',
  });

export type UpdateCompanyInput = z.infer<typeof updateCompanyInputSchema>;
