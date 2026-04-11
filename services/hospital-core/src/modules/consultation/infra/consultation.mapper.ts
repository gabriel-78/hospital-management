import { Consultation as PrismaConsultation, ConsultationStatus } from '@prisma/client';
import { AppError, Either } from '@shared/core';
import { Consultation } from '../consultation.domain.js';

export class ConsultationMapper {
  static toDomain(raw: PrismaConsultation): Either<AppError, Consultation> {
    return Consultation.fromPersistence({
      id: raw.id,
      doctorId: raw.doctorId,
      patientId: raw.patientId,
      scheduledAt: raw.scheduledAt,
      status: raw.status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toPersistence(consultation: Consultation) {
    return {
      id: consultation.id.value,
      doctorId: consultation.doctorId,
      patientId: consultation.patientId,
      scheduledAt: consultation.scheduledAt,
      status: consultation.status as ConsultationStatus,
      createdAt: consultation.createdAt,
      updatedAt: consultation.updatedAt,
      deletedAt: consultation.deletedAt,
    };
  }
}
