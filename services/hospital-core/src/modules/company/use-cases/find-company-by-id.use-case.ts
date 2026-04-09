import { Either, isLeft, makeLeft, makeRight } from '@/shared/either';
import { AppError } from '@/shared/appError';
import { ICompanyRepository } from '../infra/company.repository';
import { Company } from '../company.domain';

export class FindCompanyByIdUseCase {
  constructor(private repository: ICompanyRepository) {}

  async execute(id: string): Promise<Either<AppError, Company>> {
    const result = await this.repository.findById(id);
    if (isLeft(result)) return makeLeft(result.left);
    if (result.right === null) {
      return makeLeft(new AppError('NOT_FOUND', 'COMPANY_NOT_FOUND'));
    }
    return makeRight(result.right);
  }
}
