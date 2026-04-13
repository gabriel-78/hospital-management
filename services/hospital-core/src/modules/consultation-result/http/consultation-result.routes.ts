import { Router } from 'express';
import { validate } from '@/infra/middlewares/validate.middleware.js';
import { PrismaConsultationRepository } from '../../consultation/infra/prisma-consultation.repository.js';
import { PrismaConsultationResultRepository } from '../infra/prisma-consultation-result.repository.js';
import {
  CreateConsultationResultUseCase,
  FindConsultationResultByConsultationIdUseCase,
} from '../use-cases/index.js';
import { ConsultationResultController } from './consultation-result.controller.js';
import {
  createConsultationResultInputSchema,
  findConsultationResultByConsultationIdInputSchema,
} from '../schemas/index.js';

const consultationResultRouter = Router();

const consultationResultRepository = new PrismaConsultationResultRepository();
const consultationRepository = new PrismaConsultationRepository();

const controller = new ConsultationResultController(
  new CreateConsultationResultUseCase(consultationResultRepository, consultationRepository),
  new FindConsultationResultByConsultationIdUseCase(consultationResultRepository),
);

consultationResultRouter.post(
  '/',
  validate({ body: createConsultationResultInputSchema }),
  (req, res) => controller.create(req, res),
);

consultationResultRouter.get(
  '/:consultationId',
  validate({ params: findConsultationResultByConsultationIdInputSchema }),
  (req, res) => controller.findByConsultationId(req, res),
);

export { consultationResultRouter };
