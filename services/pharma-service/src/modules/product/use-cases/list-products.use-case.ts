import { AppError, Either } from '@shared/core';
import { Product } from '../domain/index.js';
import { IProductRepository, ProductListFilters } from '../infra/product.repository.js';

export class ListProductsUseCase {
  constructor(private repository: IProductRepository) {}

  async execute(filters?: ProductListFilters): Promise<Either<AppError, Product[]>> {
    return this.repository.list(filters);
  }
}
