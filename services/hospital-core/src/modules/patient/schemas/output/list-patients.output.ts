import { z } from 'zod';
import { patientOutputSchema, PatientOutput } from './patient.output.js';

export const listPatientsOutputSchema = z.array(patientOutputSchema);
export type ListPatientsOutput = PatientOutput[];
