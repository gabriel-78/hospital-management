import { AppError, Either, isLeft, makeLeft, makeRight } from '@shared/core';

import { IPharmaGateway } from './pharma.gateway.js';
import { PharmaListProductsFilters, PharmaProduct, PharmaProductRaw } from './pharma.types.js';
import { PharmaClient } from './pharma.client.js';

export class PharmaHttpAdapter implements IPharmaGateway {
  constructor(private readonly client: PharmaClient) {}

  async findProductById(id: string): Promise<Either<AppError, PharmaProduct | null>> {
    const result = await this.client.findProductById(id);

    if (isLeft(result)) return makeLeft(result.left);
    if (result.right === null) return makeRight(null);

    return makeRight(this.toDomain(result.right));
  }

  async listProducts(
    filters?: PharmaListProductsFilters,
  ): Promise<Either<AppError, PharmaProduct[]>> {
    const result = await this.client.listProducts(filters);

    if (isLeft(result)) return makeLeft(result.left);

    return makeRight(result.right.map((raw) => this.toDomain(raw)));
  }

  private toDomain(raw: PharmaProductRaw): PharmaProduct {
    return {
      id: raw.id,
      name: raw.name,
      category: raw.category,
      activeIngredient: raw.activeIngredient,
      createdAt: new Date(raw.createdAt),
      updatedAt: new Date(raw.updatedAt),
      deletedAt: raw.deletedAt ? new Date(raw.deletedAt) : null,
    };
  }
}
