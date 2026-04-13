import { AppError, Either } from '@shared/core';
import { Product } from '../domain/product.domain.js';

export interface ProductListFilters {
  ids?: string[];
  names?: string[];
  activeIngredients?: string[];
}

export interface IProductRepository {
  create(product: Product): Promise<Either<AppError, Product>>;
  findById(id: string): Promise<Either<AppError, Product | null>>;
  findByName(name: string): Promise<Either<AppError, Product | null>>;
  list(filters?: ProductListFilters): Promise<Either<AppError, Product[]>>;
  save(product: Product): Promise<Either<AppError, Product>>;
  softDelete(id: string): Promise<Either<AppError, void>>;
}
