import { Router } from 'express';
import { validate } from '@/infra/middlewares/validate.middleware.js';
import { PrismaDoctorRepository } from '../../doctor/infra/prisma-doctor.repository.js';
import { PrismaPatientRepository } from '../../patient/infra/prisma-patient.repository.js';
import { PrismaConsultationRepository } from '../infra/prisma-consultation.repository.js';
import {
  CancelConsultationUseCase,
  CompleteConsultationUseCase,
  CreateConsultationUseCase,
  DeleteConsultationUseCase,
  FindConsultationByIdUseCase,
  ListConsultationsUseCase,
  RescheduleConsultationUseCase,
} from '../use-cases/index.js';
import { ConsultationController } from './consultation.controller.js';
import {
  createConsultationInputSchema,
  deleteConsultationInputSchema,
  findConsultationByIdInputSchema,
  rescheduleConsultationInputSchema,
} from '../schemas/index.js';

const consultationRouter = Router();

const consultationRepository = new PrismaConsultationRepository();
const doctorRepository = new PrismaDoctorRepository();
const patientRepository = new PrismaPatientRepository();

const controller = new ConsultationController(
  new CreateConsultationUseCase(consultationRepository, doctorRepository, patientRepository),
  new FindConsultationByIdUseCase(consultationRepository),
  new ListConsultationsUseCase(consultationRepository),
  new CancelConsultationUseCase(consultationRepository),
  new CompleteConsultationUseCase(consultationRepository),
  new RescheduleConsultationUseCase(consultationRepository),
  new DeleteConsultationUseCase(consultationRepository),
);

consultationRouter.post('/', validate({ body: createConsultationInputSchema }), (req, res) =>
  controller.create(req, res),
);
consultationRouter.get('/', (req, res) => controller.list(req, res));
consultationRouter.get(
  '/:id',
  validate({ params: findConsultationByIdInputSchema }),
  (req, res) => controller.findById(req, res),
);
consultationRouter.patch(
  '/:id/cancel',
  validate({ params: findConsultationByIdInputSchema }),
  (req, res) => controller.cancel(req, res),
);
consultationRouter.patch(
  '/:id/complete',
  validate({ params: findConsultationByIdInputSchema }),
  (req, res) => controller.complete(req, res),
);
consultationRouter.patch(
  '/:id/reschedule',
  validate({ params: findConsultationByIdInputSchema, body: rescheduleConsultationInputSchema }),
  (req, res) => controller.reschedule(req, res),
);
consultationRouter.delete(
  '/:id',
  validate({ params: deleteConsultationInputSchema }),
  (req, res) => controller.delete(req, res),
);

export { consultationRouter };
