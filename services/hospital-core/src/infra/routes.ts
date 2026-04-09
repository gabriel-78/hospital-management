import { healthRouter } from '@/modules/health/health.routes';
import { companyRouter } from '@/modules/company/http/company.routes';
import { Router } from 'express';

const router = Router();

router.use('/health', healthRouter);
router.use('/companies', companyRouter);

export { router };
