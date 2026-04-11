import { AppError, Either, isLeft, makeLeft } from '@shared/core';
import { IProductRepository } from '../infra/product.repository.js';

export class DeleteProductUseCase {
  constructor(private repository: IProductRepository) {}

  async execute(id: string): Promise<Either<AppError, void>> {
    const findResult = await this.repository.findById(id);
    if (isLeft(findResult)) return makeLeft(findResult.left);
    if (findResult.right === null) {
      return makeLeft(new AppError('NOT_FOUND', 'PRODUCT_NOT_FOUND'));
    }
    return this.repository.softDelete(id);
  }
}
