import { z } from 'zod';
import { companyOutputSchema } from './company.output.js';

export const updateCompanyOutputSchema = companyOutputSchema;

export type UpdateCompanyOutput = z.infer<typeof updateCompanyOutputSchema>;
