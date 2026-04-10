import { z } from 'zod';
import { companyOutputSchema } from './company.output.js';

export const findCompanyByIdOutputSchema = companyOutputSchema;

export type FindCompanyByIdOutput = z.infer<typeof findCompanyByIdOutputSchema>;
