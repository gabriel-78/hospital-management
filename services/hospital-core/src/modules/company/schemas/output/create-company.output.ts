import { z } from 'zod';
import { companyOutputSchema } from './company.output.js';

export const createCompanyOutputSchema = companyOutputSchema;

export type CreateCompanyOutput = z.infer<typeof createCompanyOutputSchema>;
