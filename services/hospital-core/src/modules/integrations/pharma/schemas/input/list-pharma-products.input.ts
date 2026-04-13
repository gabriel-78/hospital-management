import { z } from 'zod';

const arrayQueryParam = (schema: z.ZodString) =>
  z.preprocess((v) => (typeof v === 'string' ? [v] : v), z.array(schema).optional());

export const listPharmaProductsInputSchema = z.object({
  ids: arrayQueryParam(z.string().uuid()),
  names: arrayQueryParam(z.string().min(1)),
  activeIngredients: arrayQueryParam(z.string().min(1)),
});

export type ListPharmaProductsInput = z.infer<typeof listPharmaProductsInputSchema>;
