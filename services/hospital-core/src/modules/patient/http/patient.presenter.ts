import { Patient } from '../patient.domain.js';
import {
  CreatePatientOutput,
  FindPatientByIdOutput,
  ListPatientsOutput,
  UpdatePatientOutput,
  createPatientOutputSchema,
  findPatientByIdOutputSchema,
  listPatientsOutputSchema,
  updatePatientOutputSchema,
} from '../schemas/index.js';

const toPlain = (patient: Patient) => ({
  id: patient.id.value,
  name: patient.name.value,
  createdAt: patient.createdAt,
  updatedAt: patient.updatedAt,
  deletedAt: patient.deletedAt,
});

export class PatientPresenter {
  static toCreateOutput(patient: Patient): CreatePatientOutput {
    return createPatientOutputSchema.parse(toPlain(patient));
  }

  static toFindByIdOutput(patient: Patient): FindPatientByIdOutput {
    return findPatientByIdOutputSchema.parse(toPlain(patient));
  }

  static toListOutput(patients: Patient[]): ListPatientsOutput {
    return listPatientsOutputSchema.parse(patients.map(toPlain));
  }

  static toUpdateOutput(patient: Patient): UpdatePatientOutput {
    return updatePatientOutputSchema.parse(toPlain(patient));
  }
}
