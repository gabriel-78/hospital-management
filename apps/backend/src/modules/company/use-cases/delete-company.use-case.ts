import { Either, isLeft, makeLeft } from '@/shared/either';
import { AppError } from '@/shared/appError';
import { ICompanyRepository } from '../infra/company.repository';

export class DeleteCompanyUseCase {
  constructor(private repository: ICompanyRepository) {}

  async execute(id: string): Promise<Either<AppError, void>> {
    const findResult = await this.repository.findById(id);
    if (isLeft(findResult)) return makeLeft(findResult.left);
    if (findResult.right === null) {
      return makeLeft(new AppError('NOT_FOUND', 'COMPANY_NOT_FOUND'));
    }
    return this.repository.softDelete(id);
  }
}
