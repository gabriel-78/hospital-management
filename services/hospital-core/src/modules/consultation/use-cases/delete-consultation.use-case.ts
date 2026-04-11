import { AppError, Either, isLeft, makeLeft } from '@shared/core';
import { IConsultationRepository } from '../infra/consultation.repository.js';

export class DeleteConsultationUseCase {
  constructor(private repository: IConsultationRepository) {}

  async execute(id: string): Promise<Either<AppError, void>> {
    const findResult = await this.repository.findById(id);
    if (isLeft(findResult)) return makeLeft(findResult.left);
    if (findResult.right === null) {
      return makeLeft(new AppError('NOT_FOUND', 'CONSULTATION_NOT_FOUND'));
    }

    return this.repository.softDelete(id);
  }
}
