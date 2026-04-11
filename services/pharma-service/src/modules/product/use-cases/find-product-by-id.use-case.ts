import { AppError, Either, isLeft, makeLeft, makeRight } from '@shared/core';
import { Product } from '../product.domain.js';
import { IProductRepository } from '../infra/product.repository.js';

export class FindProductByIdUseCase {
  constructor(private repository: IProductRepository) {}

  async execute(id: string): Promise<Either<AppError, Product>> {
    const result = await this.repository.findById(id);
    if (isLeft(result)) return makeLeft(result.left);
    if (result.right === null) {
      return makeLeft(new AppError('NOT_FOUND', 'PRODUCT_NOT_FOUND'));
    }
    return makeRight(result.right);
  }
}
