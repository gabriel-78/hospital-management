import { AppError, Either } from '@shared/core';
import { ConsultationResult } from '../consultation-result.domain.js';
import { Prescription } from '../prescription.domain.js';
import { PrescriptionItem } from '../prescription-item.domain.js';

export interface PrescriptionWithItems {
  prescription: Prescription;
  items: PrescriptionItem[];
}

export interface CreateConsultationResultData {
  consultationResult: ConsultationResult;
  prescription?: PrescriptionWithItems;
}

export interface ConsultationResultWithPrescription {
  consultationResult: ConsultationResult;
  prescription: PrescriptionWithItems | null;
}

export interface IConsultationResultRepository {
  create(
    data: CreateConsultationResultData,
  ): Promise<Either<AppError, ConsultationResultWithPrescription>>;
  findByConsultationId(
    consultationId: string,
  ): Promise<Either<AppError, ConsultationResultWithPrescription | null>>;
}
