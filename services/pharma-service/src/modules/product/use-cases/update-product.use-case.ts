import { AppError, Either, isLeft, makeLeft, Name } from '@shared/core';
import { Product, ProductActiveIngredient, ProductCategory } from '../domain/index.js';
import { IProductRepository } from '../infra/product.repository.js';

export interface UpdateProductDTO {
  name?: string;
  category?: string;
  activeIngredient?: string;
}

export class UpdateProductUseCase {
  constructor(private repository: IProductRepository) {}

  async execute(id: string, dto: UpdateProductDTO): Promise<Either<AppError, Product>> {
    const findResult = await this.repository.findById(id);
    if (isLeft(findResult)) return makeLeft(findResult.left);
    if (findResult.right === null) {
      return makeLeft(new AppError('NOT_FOUND', 'PRODUCT_NOT_FOUND'));
    }

    const existing = findResult.right;
    let name = existing.name;
    let category = existing.category;
    let activeIngredient = existing.activeIngredient;

    if (dto.name !== undefined) {
      const nameResult = Name.tryCreate(dto.name);
      if (isLeft(nameResult)) return makeLeft(nameResult.left);
      name = nameResult.right;
    }

    if (dto.category !== undefined) {
      const categoryResult = ProductCategory.tryCreate(dto.category);
      if (isLeft(categoryResult)) return makeLeft(categoryResult.left);
      category = categoryResult.right;
    }

    if (dto.activeIngredient !== undefined) {
      const activeIngredientResult = ProductActiveIngredient.tryCreate(dto.activeIngredient);
      if (isLeft(activeIngredientResult)) return makeLeft(activeIngredientResult.left);
      activeIngredient = activeIngredientResult.right;
    }

    const updatedResult = Product.tryCreate({
      ...existing.props,
      name,
      category,
      activeIngredient,
      updatedAt: new Date(),
    });
    if (isLeft(updatedResult)) return makeLeft(updatedResult.left);

    return this.repository.save(updatedResult.right);
  }
}
