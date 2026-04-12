import { AppError, Either } from '@shared/core';
import {
  ConsultationListItem,
  IConsultationRepository,
  ListConsultationsFilters,
} from '../infra/consultation.repository.js';

export class ListConsultationsUseCase {
  constructor(private repository: IConsultationRepository) {}

  async execute(
    filters?: ListConsultationsFilters,
  ): Promise<Either<AppError, ConsultationListItem[]>> {
    return this.repository.list(filters);
  }
}
