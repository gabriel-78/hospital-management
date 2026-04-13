import { PrescriptionItem as PrismaPrescriptionItem } from '@prisma/client';
import { AppError, Either } from '@shared/core';
import { PrescriptionItem } from '../prescription-item.domain.js';

export class PrescriptionItemMapper {
  static toDomain(raw: PrismaPrescriptionItem): Either<AppError, PrescriptionItem> {
    return PrescriptionItem.fromPersistence({
      id: raw.id,
      prescriptionId: raw.prescriptionId,
      remedyId: raw.remedyId,
      medication: raw.medication,
      dosage: raw.dosage,
      duration: raw.duration,
      instructions: raw.instructions,
    });
  }

  static toPersistence(item: PrescriptionItem) {
    return {
      id: item.id.value,
      remedyId: item.remedyId,
      medication: item.medication,
      dosage: item.dosage,
      duration: item.duration,
      instructions: item.instructions,
    };
  }
}
