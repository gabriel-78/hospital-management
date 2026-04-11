import { AppError, Either } from '@shared/core';
import { Consultation } from '../consultation.domain.js';

export interface IConsultationRepository {
  create(consultation: Consultation): Promise<Either<AppError, Consultation>>;
  findById(id: string): Promise<Either<AppError, Consultation | null>>;
  findConflictingForDoctor(
    doctorId: string,
    scheduledAt: Date,
    excludeId?: string,
  ): Promise<Either<AppError, Consultation | null>>;
  findConflictingForPatient(
    patientId: string,
    scheduledAt: Date,
    excludeId?: string,
  ): Promise<Either<AppError, Consultation | null>>;
  list(): Promise<Either<AppError, Consultation[]>>;
  save(consultation: Consultation): Promise<Either<AppError, Consultation>>;
  softDelete(id: string): Promise<Either<AppError, void>>;
}
