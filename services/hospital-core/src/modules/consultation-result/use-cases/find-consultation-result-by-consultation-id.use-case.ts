import { AppError, Either, isLeft, makeLeft, makeRight } from '@shared/core';
import {
  ConsultationResultWithPrescription,
  IConsultationResultRepository,
} from '../infra/consultation-result.repository.js';

export class FindConsultationResultByConsultationIdUseCase {
  constructor(private repository: IConsultationResultRepository) {}

  async execute(
    consultationId: string,
  ): Promise<Either<AppError, ConsultationResultWithPrescription>> {
    const result = await this.repository.findByConsultationId(consultationId);
    if (isLeft(result)) return makeLeft(result.left);
    if (result.right === null) {
      return makeLeft(new AppError('NOT_FOUND', 'CONSULTATION_RESULT_NOT_FOUND'));
    }
    return makeRight(result.right);
  }
}
