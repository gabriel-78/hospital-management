import { AppError, Either } from '@shared/core';
import { Consultation, ConsultationStatusEnum } from '../consultation.domain.js';

export interface ListConsultationsFilters {
  patientId?: string;
  status?: ConsultationStatusEnum[];
}

export interface ConsultationListItem {
  consultation: Consultation;
  doctorName: string;
}

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
  list(filters?: ListConsultationsFilters): Promise<Either<AppError, ConsultationListItem[]>>;
  save(consultation: Consultation): Promise<Either<AppError, Consultation>>;
  softDelete(id: string): Promise<Either<AppError, void>>;
}
