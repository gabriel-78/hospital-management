import { ConsultationResult as PrismaConsultationResult } from '@prisma/client';
import { AppError, Either } from '@shared/core';
import { ConsultationResult } from '../consultation-result.domain.js';

export class ConsultationResultMapper {
  static toDomain(raw: PrismaConsultationResult): Either<AppError, ConsultationResult> {
    return ConsultationResult.fromPersistence({
      id: raw.id,
      consultationId: raw.consultationId,
      description: raw.description,
      createdAt: raw.createdAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toPersistence(consultationResult: ConsultationResult) {
    return {
      id: consultationResult.id.value,
      consultationId: consultationResult.consultationId,
      description: consultationResult.description,
      createdAt: consultationResult.createdAt,
    };
  }
}
