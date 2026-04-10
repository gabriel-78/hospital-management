import { Either, AppError } from '@shared/core';
import { Company } from '../company.domain.js';

export interface ICompanyRepository {
  create(company: Company): Promise<Either<AppError, Company>>;
  findById(id: string): Promise<Either<AppError, Company | null>>;
  findByCnpj(cnpj: string): Promise<Either<AppError, Company | null>>;
  list(): Promise<Either<AppError, Company[]>>;
  save(company: Company): Promise<Either<AppError, Company>>;
  softDelete(id: string): Promise<Either<AppError, void>>;
}
