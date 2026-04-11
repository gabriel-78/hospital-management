import { Doctor } from '../doctor.domain.js';
import {
  CreateDoctorOutput,
  FindDoctorByIdOutput,
  ListDoctorsOutput,
  UpdateDoctorOutput,
  createDoctorOutputSchema,
  findDoctorByIdOutputSchema,
  listDoctorsOutputSchema,
  updateDoctorOutputSchema,
} from '../schemas/index.js';

const toPlain = (doctor: Doctor) => ({
  id: doctor.id.value,
  name: doctor.name.value,
  crm: doctor.crm.value,
  createdAt: doctor.createdAt,
  updatedAt: doctor.updatedAt,
  deletedAt: doctor.deletedAt,
});

export class DoctorPresenter {
  static toCreateOutput(doctor: Doctor): CreateDoctorOutput {
    return createDoctorOutputSchema.parse(toPlain(doctor));
  }

  static toFindByIdOutput(doctor: Doctor): FindDoctorByIdOutput {
    return findDoctorByIdOutputSchema.parse(toPlain(doctor));
  }

  static toListOutput(doctors: Doctor[]): ListDoctorsOutput {
    return listDoctorsOutputSchema.parse(doctors.map(toPlain));
  }

  static toUpdateOutput(doctor: Doctor): UpdateDoctorOutput {
    return updateDoctorOutputSchema.parse(toPlain(doctor));
  }
}
