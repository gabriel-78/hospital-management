import { AppError, Either } from '@shared/core';
import { IPharmaGateway } from '../http/pharma.gateway.js';
import { PharmaListProductsFilters, PharmaProduct } from '../http/pharma.types.js';

export class ListPharmaProductsUseCase {
  constructor(private gateway: IPharmaGateway) {}

  async execute(filters?: PharmaListProductsFilters): Promise<Either<AppError, PharmaProduct[]>> {
    return this.gateway.listProducts(filters);
  }
}
