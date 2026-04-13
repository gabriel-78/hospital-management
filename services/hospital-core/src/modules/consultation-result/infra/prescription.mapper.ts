import { Prescription as PrismaPrescription } from '@prisma/client';
import { AppError, Either } from '@shared/core';
import { Prescription } from '../prescription.domain.js';

export class PrescriptionMapper {
  static toDomain(raw: PrismaPrescription): Either<AppError, Prescription> {
    return Prescription.fromPersistence({
      id: raw.id,
      consultationResultId: raw.consultationResultId,
      createdAt: raw.createdAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toPersistence(prescription: Prescription) {
    return {
      id: prescription.id.value,
      consultationResultId: prescription.consultationResultId,
      createdAt: prescription.createdAt,
    };
  }
}
