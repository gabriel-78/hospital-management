import { Router } from 'express';
import { validate } from '@/infra/middlewares/validate.middleware.js';
import { PrismaDoctorRepository } from '../infra/prisma-doctor.repository.js';
import {
  CreateDoctorUseCase,
  DeleteDoctorUseCase,
  FindDoctorByIdUseCase,
  ListDoctorsUseCase,
  UpdateDoctorUseCase,
} from '../use-cases/index.js';
import { DoctorController } from './doctor.controller.js';
import {
  createDoctorInputSchema,
  deleteDoctorInputSchema,
  findDoctorByIdInputSchema,
  updateDoctorInputSchema,
} from '../schemas/index.js';

const doctorRouter = Router();

const repository = new PrismaDoctorRepository();
const controller = new DoctorController(
  new CreateDoctorUseCase(repository),
  new FindDoctorByIdUseCase(repository),
  new ListDoctorsUseCase(repository),
  new UpdateDoctorUseCase(repository),
  new DeleteDoctorUseCase(repository),
);

doctorRouter.post('/', validate({ body: createDoctorInputSchema }), (req, res) =>
  controller.create(req, res),
);
doctorRouter.get('/', (req, res) => controller.list(req, res));
doctorRouter.get('/:id', validate({ params: findDoctorByIdInputSchema }), (req, res) =>
  controller.findById(req, res),
);
doctorRouter.put(
  '/:id',
  validate({ params: findDoctorByIdInputSchema, body: updateDoctorInputSchema }),
  (req, res) => controller.update(req, res),
);
doctorRouter.delete('/:id', validate({ params: deleteDoctorInputSchema }), (req, res) =>
  controller.delete(req, res),
);

export { doctorRouter };
