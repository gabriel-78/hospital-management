import { z } from 'zod';
import { companyOutputSchema } from './company.output';

export const createCompanyOutputSchema = companyOutputSchema;

export type CreateCompanyOutput = z.infer<typeof createCompanyOutputSchema>;
