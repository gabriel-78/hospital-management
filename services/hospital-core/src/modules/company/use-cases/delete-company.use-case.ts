import { Either, isLeft, makeLeft, AppError } from '@shared/core';
import { ICompanyRepository } from '../infra/company.repository.js';

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
