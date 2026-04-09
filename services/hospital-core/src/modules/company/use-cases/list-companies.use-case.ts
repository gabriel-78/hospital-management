import { Either } from '@/shared/either';
import { AppError } from '@/shared/appError';
import { ICompanyRepository } from '../infra/company.repository';
import { Company } from '../company.domain';

export class ListCompaniesUseCase {
  constructor(private repository: ICompanyRepository) {}

  async execute(): Promise<Either<AppError, Company[]>> {
    return this.repository.list();
  }
}
