import { AppError, Either, isLeft, makeLeft } from '@shared/core';
import { Consultation } from '../consultation.domain.js';
import { IConsultationRepository } from '../infra/consultation.repository.js';
import { RescheduleConsultationInput } from '../schemas/index.js';

export class RescheduleConsultationUseCase {
  constructor(private repository: IConsultationRepository) {}

  async execute(
    id: string,
    dto: RescheduleConsultationInput,
  ): Promise<Either<AppError, Consultation>> {
    const findResult = await this.repository.findById(id);
    if (isLeft(findResult)) return makeLeft(findResult.left);
    if (findResult.right === null) {
      return makeLeft(new AppError('NOT_FOUND', 'CONSULTATION_NOT_FOUND'));
    }

    const consultation = findResult.right;

    const validationResult = await this.validate(id, dto, consultation);
    if (isLeft(validationResult)) return makeLeft(validationResult.left);

    const updatedResult = Consultation.tryCreate({
      ...consultation.props,
      scheduledAt: dto.scheduledAt,
      updatedAt: new Date(),
    });
    if (isLeft(updatedResult)) return makeLeft(updatedResult.left);

    return this.repository.save(updatedResult.right);
  }

  private async validate(
    id: string,
    dto: RescheduleConsultationInput,
    consultation: Consultation,
  ): Promise<Either<AppError, void>> {
    const canRescheduleResult = consultation.canBeRescheduled(dto.scheduledAt);
    if (isLeft(canRescheduleResult)) return makeLeft(canRescheduleResult.left);

    const doctorConflictResult = await this.repository.findConflictingForDoctor(
      consultation.doctorId,
      dto.scheduledAt,
      id,
    );
    if (isLeft(doctorConflictResult)) return makeLeft(doctorConflictResult.left);
    if (doctorConflictResult.right !== null) {
      return makeLeft(new AppError('DOMAIN_ERROR', 'DOCTOR_ALREADY_HAS_CONSULTATION_AT_THIS_TIME'));
    }

    const patientConflictResult = await this.repository.findConflictingForPatient(
      consultation.patientId,
      dto.scheduledAt,
      id,
    );
    if (isLeft(patientConflictResult)) return makeLeft(patientConflictResult.left);
    if (patientConflictResult.right !== null) {
      return makeLeft(
        new AppError('DOMAIN_ERROR', 'PATIENT_ALREADY_HAS_CONSULTATION_AT_THIS_TIME'),
      );
    }

    return makeLeft(undefined);
  }
}
