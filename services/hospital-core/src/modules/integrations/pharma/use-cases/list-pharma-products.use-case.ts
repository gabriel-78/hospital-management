import { AppError, Either } from '@shared/core';
import { IPharmaGateway } from '../pharma.gateway.js';
import { PharmaListProductsFilters, PharmaProduct } from '../pharma.types.js';

export class ListPharmaProductsUseCase {
  constructor(private gateway: IPharmaGateway) {}

  async execute(filters?: PharmaListProductsFilters): Promise<Either<AppError, PharmaProduct[]>> {
    return this.gateway.listProducts(filters);
  }
}
