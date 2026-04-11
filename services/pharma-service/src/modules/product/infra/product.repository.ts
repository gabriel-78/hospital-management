import { AppError, Either } from '@shared/core';
import { Product } from '../product.domain.js';

export interface IProductRepository {
  create(product: Product): Promise<Either<AppError, Product>>;
  findById(id: string): Promise<Either<AppError, Product | null>>;
  findByName(name: string): Promise<Either<AppError, Product | null>>;
  list(): Promise<Either<AppError, Product[]>>;
  save(product: Product): Promise<Either<AppError, Product>>;
  softDelete(id: string): Promise<Either<AppError, void>>;
}
