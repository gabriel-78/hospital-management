import { Either, AppError } from '@shared/core';
import { ICompanyRepository } from '../infra/company.repository.js';
import { Company } from '../company.domain.js';

export class ListCompaniesUseCase {
  constructor(private repository: ICompanyRepository) {}

  async execute(): Promise<Either<AppError, Company[]>> {
    return this.repository.list();
  }
}
