import { healthRouter } from '@/modules/health/health.routes.js';
import { productRouter } from '@/modules/product/http/product.routes.js';
import { Router } from 'express';

const router = Router();

router.use('/health', healthRouter);
router.use('/products', productRouter);

export { router };
