import { z } from 'zod';
import { pharmaProductOutputSchema, PharmaProductOutput } from './pharma-product.output.js';

export const listPharmaProductsOutputSchema = z.array(pharmaProductOutputSchema);
export type ListPharmaProductsOutput = PharmaProductOutput[];
