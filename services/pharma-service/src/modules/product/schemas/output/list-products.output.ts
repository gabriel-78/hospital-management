import { z } from 'zod';
import { productOutputSchema, ProductOutput } from './product.output.js';

export const listProductsOutputSchema = z.array(productOutputSchema);
export type ListProductsOutput = ProductOutput[];
