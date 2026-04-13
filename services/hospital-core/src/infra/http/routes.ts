import { companyRouter } from '@/modules/company/http/company.routes.js';
import { consultationResultRouter } from '@/modules/consultation-result/http/consultation-result.routes.js';
import { consultationRouter } from '@/modules/consultation/http/consultation.routes.js';
import { doctorRouter } from '@/modules/doctor/http/doctor.routes.js';
import { healthRouter } from '@/modules/health/health.routes.js';
import { patientRouter } from '@/modules/patient/http/patient.routes.js';
import { pharmaRouter } from '@/modules/integrations/pharma/http/pharma.routes.js';
import { Router } from 'express';

const router = Router();

router.use('/health', healthRouter);
router.use('/companies', companyRouter);
router.use('/doctors', doctorRouter);
router.use('/patients', patientRouter);
router.use('/consultations', consultationRouter);
router.use('/consultation-results', consultationResultRouter);
router.use('/integrations/pharma', pharmaRouter);

export { router };
