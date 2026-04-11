import { z } from 'zod';
import { consultationOutputSchema, ConsultationOutput } from './consultation.output.js';

export const listConsultationsOutputSchema = z.array(consultationOutputSchema);
export type ListConsultationsOutput = ConsultationOutput[];
