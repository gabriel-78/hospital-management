import { AppError, Either, isLeft, makeLeft, makeRight } from '@shared/core';
import { IPharmaGateway } from './pharma.gateway.js';
import { PharmaClient } from './pharma.client.js';
import { PharmaProduct } from './pharma.types.js';

export class PharmaHttpAdapter implements IPharmaGateway {
  constructor(private readonly client: PharmaClient) {}

  async findProductById(id: string): Promise<Either<AppError, PharmaProduct | null>> {
    const result = await this.client.findProductById(id);

    if (isLeft(result)) return makeLeft(result.left);
    if (result.right === null) return makeRight(null);

    const raw = result.right;

    return makeRight({
      id: raw.id,
      name: raw.name,
      category: raw.category,
      activeIngredient: raw.activeIngredient,
      createdAt: new Date(raw.createdAt),
      updatedAt: new Date(raw.updatedAt),
      deletedAt: raw.deletedAt ? new Date(raw.deletedAt) : null,
    });
  }
}
