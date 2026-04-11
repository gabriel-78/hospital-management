import { Router } from 'express';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';
import { HealthRepository } from './health.repository.js';

const healthRouter = Router();

const repository = new HealthRepository();
const service = new HealthService(repository);
const controller = new HealthController(service);

healthRouter.get('/', (req, res) => controller.handle(req, res));

export { healthRouter };
