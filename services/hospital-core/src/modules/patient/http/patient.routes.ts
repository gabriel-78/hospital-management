import { Router } from 'express';
import { validate } from '@/infra/middlewares/validate.middleware.js';
import { RedisCacheProvider } from '@/infra/cache/index.js';
import { PrismaPatientRepository } from '../infra/prisma-patient.repository.js';
import { CachedPatientRepository } from '../infra/cached-patient.repository.js';
import {
  CreatePatientUseCase,
  DeletePatientUseCase,
  FindPatientByIdUseCase,
  ListPatientsUseCase,
  UpdatePatientUseCase,
} from '../use-cases/index.js';
import { PatientController } from './patient.controller.js';
import {
  createPatientInputSchema,
  deletePatientInputSchema,
  findPatientByIdInputSchema,
  updatePatientInputSchema,
} from '../schemas/index.js';

const patientRouter = Router();

const baseRepository = new PrismaPatientRepository();
const repository = new CachedPatientRepository(baseRepository, new RedisCacheProvider());

const controller = new PatientController(
  new CreatePatientUseCase(repository),
  new FindPatientByIdUseCase(repository),
  new ListPatientsUseCase(repository),
  new UpdatePatientUseCase(repository),
  new DeletePatientUseCase(repository),
);

patientRouter.post('/', validate({ body: createPatientInputSchema }), (req, res) =>
  controller.create(req, res),
);
patientRouter.get('/', (req, res) => controller.list(req, res));
patientRouter.get('/:id', validate({ params: findPatientByIdInputSchema }), (req, res) =>
  controller.findById(req, res),
);
patientRouter.put(
  '/:id',
  validate({ params: findPatientByIdInputSchema, body: updatePatientInputSchema }),
  (req, res) => controller.update(req, res),
);
patientRouter.delete('/:id', validate({ params: deletePatientInputSchema }), (req, res) =>
  controller.delete(req, res),
);

export { patientRouter };
