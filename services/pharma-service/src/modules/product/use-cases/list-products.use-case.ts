import { AppError, Either } from '@shared/core';
import { Product } from '../product.domain.js';
import { IProductRepository } from '../infra/product.repository.js';

export class ListProductsUseCase {
  constructor(private repository: IProductRepository) {}

  async execute(): Promise<Either<AppError, Product[]>> {
    return this.repository.list();
  }
}
