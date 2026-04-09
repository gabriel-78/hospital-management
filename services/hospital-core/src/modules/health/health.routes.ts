import { Router } from 'express';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { HealthRepository } from './health.repository';

const healthRouter = Router();

const repository = new HealthRepository();
const service = new HealthService(repository);
const controller = new HealthController(service);

healthRouter.get('/', (req, res) => controller.handle(req, res));

export { healthRouter };
