import { AppError, Either } from '@shared/core';
import { PharmaListProductsFilters, PharmaProduct } from './pharma.types.js';

export interface IPharmaGateway {
  findProductById(id: string): Promise<Either<AppError, PharmaProduct | null>>;
  listProducts(filters?: PharmaListProductsFilters): Promise<Either<AppError, PharmaProduct[]>>;
}
