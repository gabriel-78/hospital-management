import { AppError, Either, isLeft, makeLeft, makeRight } from '@shared/core';
import { Consultation } from '../consultation.domain.js';
import { IConsultationRepository } from '../infra/consultation.repository.js';

export class FindConsultationByIdUseCase {
  constructor(private repository: IConsultationRepository) {}

  async execute(id: string): Promise<Either<AppError, Consultation>> {
    const result = await this.repository.findById(id);
    if (isLeft(result)) return makeLeft(result.left);
    if (result.right === null) {
      return makeLeft(new AppError('NOT_FOUND', 'CONSULTATION_NOT_FOUND'));
    }

    return makeRight(result.right);
  }
}
