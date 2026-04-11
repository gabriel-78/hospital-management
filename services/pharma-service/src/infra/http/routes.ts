import { healthRouter } from '@/modules/health/health.routes.js';
import { Router } from 'express';

const router = Router();

router.use('/health', healthRouter);

export { router };
