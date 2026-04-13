import { AppError, Either, Id, isLeft, makeLeft } from '@shared/core';
import { ConsultationResult } from '../consultation-result.domain.js';
import { Prescription } from '../prescription.domain.js';
import { PrescriptionItem } from '../prescription-item.domain.js';
import {
  ConsultationResultWithPrescription,
  IConsultationResultRepository,
} from '../infra/consultation-result.repository.js';
import { IConsultationRepository } from '../../consultation/infra/consultation.repository.js';
import { CreateConsultationResultInput } from '../schemas/index.js';

export class CreateConsultationResultUseCase {
  constructor(
    private consultationResultRepository: IConsultationResultRepository,
    private consultationRepository: IConsultationRepository,
  ) {}

  async execute(
    dto: CreateConsultationResultInput,
  ): Promise<Either<AppError, ConsultationResultWithPrescription>> {
    const consultationResult = await this.consultationRepository.findById(dto.consultationId);
    if (isLeft(consultationResult)) return makeLeft(consultationResult.left);
    if (consultationResult.right === null) {
      return makeLeft(new AppError('NOT_FOUND', 'CONSULTATION_NOT_FOUND'));
    }

    const consultation = consultationResult.right;

    if (consultation.doctorId !== dto.doctorId) {
      return makeLeft(new AppError('DOMAIN_ERROR', 'DOCTOR_NOT_AUTHORIZED_FOR_THIS_CONSULTATION'));
    }

    const existingResult = await this.consultationResultRepository.findByConsultationId(
      dto.consultationId,
    );
    if (isLeft(existingResult)) return makeLeft(existingResult.left);
    if (existingResult.right !== null) {
      return makeLeft(new AppError('DOMAIN_ERROR', 'CONSULTATION_RESULT_ALREADY_EXISTS'));
    }

    let entityId: Id | undefined;
    if (dto.id) {
      const idResult = Id.tryCreate(dto.id);
      if (isLeft(idResult)) return makeLeft(idResult.left);
      entityId = idResult.right;
    }

    const consultationResultEntity = ConsultationResult.tryCreate({
      ...(entityId ? { id: entityId } : {}),
      consultationId: dto.consultationId,
      description: dto.description,
    });
    if (isLeft(consultationResultEntity)) return makeLeft(consultationResultEntity.left);

    let prescriptionData: { prescription: Prescription; items: PrescriptionItem[] } | undefined;

    if (dto.prescription) {
      const prescriptionEntity = Prescription.tryCreate({
        consultationResultId: consultationResultEntity.right.id.value,
      });
      if (isLeft(prescriptionEntity)) return makeLeft(prescriptionEntity.left);

      const items: PrescriptionItem[] = [];
      for (const itemDto of dto.prescription.items) {
        const itemEntity = PrescriptionItem.tryCreate({
          prescriptionId: prescriptionEntity.right.id.value,
          medication: itemDto.medication,
          dosage: itemDto.dosage,
          duration: itemDto.duration,
          instructions: itemDto.instructions ?? null,
        });
        if (isLeft(itemEntity)) return makeLeft(itemEntity.left);
        items.push(itemEntity.right);
      }

      prescriptionData = { prescription: prescriptionEntity.right, items };
    }

    return this.consultationResultRepository.create({
      consultationResult: consultationResultEntity.right,
      prescription: prescriptionData,
    });
  }
}
