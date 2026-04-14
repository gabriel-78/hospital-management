import z from "zod";

export const PharmaProductResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  category: z.string(),
  activeIngredient: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export const ListPharmaProductsResponseSchema = z.array(PharmaProductResponseSchema);

export type PharmaProductResponse = z.infer<typeof PharmaProductResponseSchema>;
export type ListPharmaProductsResponse = z.infer<typeof ListPharmaProductsResponseSchema>;
