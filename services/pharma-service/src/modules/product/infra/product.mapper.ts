import { Product as PrismaProduct } from '@prisma/client';
import { AppError, Either } from '@shared/core';
import { Product } from '../product.domain.js';

export class ProductMapper {
  static toDomain(raw: PrismaProduct): Either<AppError, Product> {
    return Product.fromPersistence({
      id: raw.id,
      name: raw.name,
      category: raw.category,
      activeIngredient: raw.activeIngredient,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toPersistence(product: Product) {
    return {
      id: product.id.value,
      name: product.name.value,
      category: product.category.value,
      activeIngredient: product.activeIngredient.value,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      deletedAt: product.deletedAt,
    };
  }
}
