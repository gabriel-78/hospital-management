import { AppError, Either, isLeft, makeLeft, makeRight } from '@shared/core';
import { prisma } from '@/infra/database/prisma.js';
import { Product } from '../product.domain.js';
import { IProductRepository } from './product.repository.js';
import { ProductMapper } from './product.mapper.js';

export class PrismaProductRepository implements IProductRepository {
  async create(product: Product): Promise<Either<AppError, Product>> {
    const data = ProductMapper.toPersistence(product);

    const raw = await prisma.product.create({ data });

    const result = ProductMapper.toDomain(raw);
    if (isLeft(result)) return makeLeft(result.left);

    return makeRight(result.right);
  }

  async findById(id: string): Promise<Either<AppError, Product | null>> {
    const raw = await prisma.product.findFirst({
      where: { id, deletedAt: null },
    });

    if (!raw) return makeRight(null);

    const result = ProductMapper.toDomain(raw);
    if (isLeft(result)) return makeLeft(result.left);

    return makeRight(result.right);
  }

  async findByName(name: string): Promise<Either<AppError, Product | null>> {
    const raw = await prisma.product.findFirst({
      where: { name, deletedAt: null },
    });

    if (!raw) return makeRight(null);

    const result = ProductMapper.toDomain(raw);
    if (isLeft(result)) return makeLeft(result.left);

    return makeRight(result.right);
  }

  async list(): Promise<Either<AppError, Product[]>> {
    const rows = await prisma.product.findMany({
      where: { deletedAt: null },
    });

    const products: Product[] = [];

    for (const raw of rows) {
      const result = ProductMapper.toDomain(raw);
      if (isLeft(result)) return makeLeft(result.left);
      products.push(result.right);
    }

    return makeRight(products);
  }

  async save(product: Product): Promise<Either<AppError, Product>> {
    const data = ProductMapper.toPersistence(product);

    const raw = await prisma.product.update({
      where: { id: data.id },
      data: {
        name: data.name,
        category: data.category,
        activeIngredient: data.activeIngredient,
        updatedAt: new Date(),
      },
    });

    const result = ProductMapper.toDomain(raw);
    if (isLeft(result)) return makeLeft(result.left);

    return makeRight(result.right);
  }

  async softDelete(id: string): Promise<Either<AppError, void>> {
    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return makeRight(undefined);
  }
}
