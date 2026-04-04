import { z } from 'zod';
import { companyOutputSchema } from './company.output';

export const updateCompanyOutputSchema = companyOutputSchema;

export type UpdateCompanyOutput = z.infer<typeof updateCompanyOutputSchema>;
