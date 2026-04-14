import { AppError, Either, isLeft, makeRight } from '@shared/core';
import type { CacheProvider } from '@/shared/domain/cache/cache-provider.interface.js';
import { IPharmaGateway } from './pharma.gateway.js';
import { PharmaListProductsFilters, PharmaProduct, PharmaProductRaw } from './pharma.types.js';

const TTL = 600;

function buildListKey(filters?: PharmaListProductsFilters): string {
  if (!filters) return 'pharma:products:list';

  const parts: string[] = [];
  if (filters.ids?.length) parts.push(`ids=${[...filters.ids].sort().join(',')}`);
  if (filters.names?.length) parts.push(`names=${[...filters.names].sort().join(',')}`);
  if (filters.activeIngredients?.length)
    parts.push(`activeIngredients=${[...filters.activeIngredients].sort().join(',')}`);

  return parts.length > 0 ? `pharma:products:list:${parts.join(':')}` : 'pharma:products:list';
}

function rawToDomain(raw: PharmaProductRaw): PharmaProduct {
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

function domainToRaw(product: PharmaProduct): PharmaProductRaw {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    activeIngredient: product.activeIngredient,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    deletedAt: product.deletedAt ? product.deletedAt.toISOString() : null,
  };
}

export class CachedPharmaGateway implements IPharmaGateway {
  constructor(
    private readonly inner: IPharmaGateway,
    private readonly cache: CacheProvider,
  ) {}

  async listProducts(
    filters?: PharmaListProductsFilters,
  ): Promise<Either<AppError, PharmaProduct[]>> {
    const key = buildListKey(filters);
    const cached = await this.cache.get<PharmaProductRaw[]>(key);

    if (cached !== null) {
      return makeRight(cached.map(rawToDomain));
    }

    const result = await this.inner.listProducts(filters);
    if (isLeft(result)) return result;

    await this.cache.set(key, result.right.map(domainToRaw), TTL);
    return result;
  }

  async findProductById(id: string): Promise<Either<AppError, PharmaProduct | null>> {
    const key = `pharma:products:${id}`;
    const cached = await this.cache.get<PharmaProductRaw>(key);

    if (cached !== null) {
      return makeRight(rawToDomain(cached));
    }

    const result = await this.inner.findProductById(id);
    if (isLeft(result) || result.right === null) return result;

    await this.cache.set(key, domainToRaw(result.right), TTL);
    return result;
  }
}
