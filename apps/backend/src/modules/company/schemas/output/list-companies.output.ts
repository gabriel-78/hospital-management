import { z } from 'zod';
import { companyOutputSchema } from './company.output';

export const listCompaniesOutputSchema = z.array(companyOutputSchema);

export type ListCompaniesOutput = z.infer<typeof listCompaniesOutputSchema>;
