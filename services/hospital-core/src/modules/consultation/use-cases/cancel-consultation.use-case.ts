import { AppError, Either, isLeft, makeLeft } from '@shared/core';
import { Consultation, ConsultationStatusEnum } from '../consultation.domain.js';
import { IConsultationRepository } from '../infra/consultation.repository.js';

export class CancelConsultationUseCase {
  constructor(private repository: IConsultationRepository) {}

  async execute(id: string): Promise<Either<AppError, Consultation>> {
    const findResult = await this.repository.findById(id);
    if (isLeft(findResult)) return makeLeft(findResult.left);
    if (findResult.right === null) {
      return makeLeft(new AppError('NOT_FOUND', 'CONSULTATION_NOT_FOUND'));
    }

    const consultation = findResult.right;

    const validationResult = consultation.canBeCancelled;
    if (isLeft(validationResult)) return makeLeft(validationResult.left);

    const updatedResult = Consultation.tryCreate({
      ...consultation.props,
      status: ConsultationStatusEnum.CANCELLED,
      updatedAt: new Date(),
    });
    if (isLeft(updatedResult)) return makeLeft(updatedResult.left);

    return this.repository.save(updatedResult.right);
  }
}
