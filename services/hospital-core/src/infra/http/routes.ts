import { companyRouter } from '@/modules/company/http/company.routes.js';
import { doctorRouter } from '@/modules/doctor/http/doctor.routes.js';
import { healthRouter } from '@/modules/health/health.routes.js';
import { patientRouter } from '@/modules/patient/http/patient.routes.js';
import { Router } from 'express';

const router = Router();

router.use('/health', healthRouter);
router.use('/companies', companyRouter);
router.use('/doctors', doctorRouter);
router.use('/patients', patientRouter);

export { router };
