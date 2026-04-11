import { Doctor as PrismaDoctor } from '@prisma/client';
import { AppError, Either } from '@shared/core';
import { Doctor } from '../doctor.domain.js';

export class DoctorMapper {
  static toDomain(raw: PrismaDoctor): Either<AppError, Doctor> {
    return Doctor.fromPersistence({
      id: raw.id,
      name: raw.name,
      crm: raw.crm,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toPersistence(doctor: Doctor) {
    return {
      id: doctor.id.value,
      name: doctor.name.value,
      crm: doctor.crm.value,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
      deletedAt: doctor.deletedAt,
    };
  }
}
