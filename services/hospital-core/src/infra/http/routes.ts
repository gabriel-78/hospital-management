import { companyRouter } from '@/modules/company/http/company.routes.js';
import { doctorRouter } from '@/modules/doctor/http/doctor.routes.js';
import { healthRouter } from '@/modules/health/health.routes.js';
import { Router } from 'express';

const router = Router();

router.use('/health', healthRouter);
router.use('/companies', companyRouter);
router.use('/doctors', doctorRouter);

export { router };
