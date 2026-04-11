import { AppError, Either } from '@shared/core';
import { Consultation } from '../consultation.domain.js';
import { IConsultationRepository } from '../infra/consultation.repository.js';

export class ListConsultationsUseCase {
  constructor(private repository: IConsultationRepository) {}

  async execute(): Promise<Either<AppError, Consultation[]>> {
    return this.repository.list();
  }
}
