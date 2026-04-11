import { Patient as PrismaPatient } from '@prisma/client';
import { AppError, Either } from '@shared/core';
import { Patient } from '../patient.domain.js';

export class PatientMapper {
  static toDomain(raw: PrismaPatient): Either<AppError, Patient> {
    return Patient.fromPersistence({
      id: raw.id,
      name: raw.name,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toPersistence(patient: Patient) {
    return {
      id: patient.id.value,
      name: patient.name.value,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
      deletedAt: patient.deletedAt,
    };
  }
}
