import { Product } from '../domain/index.js';
import {
  CreateProductOutput,
  FindProductByIdOutput,
  ListProductsOutput,
  UpdateProductOutput,
} from '../schemas/index.js';

export class ProductPresenter {
  private static toOutput(product: Product) {
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

  static toCreateOutput(product: Product): CreateProductOutput {
    return this.toOutput(product);
  }

  static toFindByIdOutput(product: Product): FindProductByIdOutput {
    return this.toOutput(product);
  }

  static toListOutput(products: Product[]): ListProductsOutput {
    return products.map((p) => this.toOutput(p));
  }

  static toUpdateOutput(product: Product): UpdateProductOutput {
    return this.toOutput(product);
  }
}
