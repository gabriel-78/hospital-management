import { z } from 'zod';
import { consultationOutputSchema } from './consultation.output.js';

export const consultationListItemOutputSchema = consultationOutputSchema.extend({
  doctorName: z.string(),
  patientName: z.string(),
});

export const listConsultationsOutputSchema = z.array(consultationListItemOutputSchema);

export type ConsultationListItemOutput = z.infer<typeof consultationListItemOutputSchema>;
export type ListConsultationsOutput = ConsultationListItemOutput[];
