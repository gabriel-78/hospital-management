import { AppError, Either, isLeft, makeLeft, Name } from '@shared/core';
import { Product, ProductActiveIngredient, ProductCategory } from '../product.domain.js';
import { IProductRepository } from '../infra/product.repository.js';

export interface CreateProductDTO {
  name: string;
  category: string;
  activeIngredient: string;
}

export class CreateProductUseCase {
  constructor(private repository: IProductRepository) {}

  async execute(dto: CreateProductDTO): Promise<Either<AppError, Product>> {
    const existingResult = await this.repository.findByName(dto.name);
    if (isLeft(existingResult)) return makeLeft(existingResult.left);
    if (existingResult.right !== null) {
      return makeLeft(new AppError('DOMAIN_ERROR', 'PRODUCT_NAME_ALREADY_EXISTS'));
    }

    const nameResult = Name.tryCreate(dto.name);
    if (isLeft(nameResult)) return makeLeft(nameResult.left);

    const categoryResult = ProductCategory.tryCreate(dto.category);
    if (isLeft(categoryResult)) return makeLeft(categoryResult.left);

    const activeIngredientResult = ProductActiveIngredient.tryCreate(dto.activeIngredient);
    if (isLeft(activeIngredientResult)) return makeLeft(activeIngredientResult.left);

    const productResult = Product.tryCreate({
      name: nameResult.right,
      category: categoryResult.right,
      activeIngredient: activeIngredientResult.right,
    });
    if (isLeft(productResult)) return makeLeft(productResult.left);

    return this.repository.create(productResult.right);
  }
}
