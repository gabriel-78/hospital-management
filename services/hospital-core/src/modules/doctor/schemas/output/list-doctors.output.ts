import { z } from 'zod';
import { doctorOutputSchema, DoctorOutput } from './doctor.output.js';

export const listDoctorsOutputSchema = z.array(doctorOutputSchema);
export type ListDoctorsOutput = DoctorOutput[];
