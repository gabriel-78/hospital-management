import {
  AppError,
  Either,
  Entity,
  EntityProps,
  Id,
  isLeft,
  makeLeft,
  makeRight,
  Name,
} from '@shared/core';
import { ProductCategory, ProductActiveIngredient } from './vo/index.js';

export interface ProductProps extends EntityProps {
  name: Name;
  category: ProductCategory;
  activeIngredient: ProductActiveIngredient;
}

export interface ProductPersistenceRaw {
  id: string;
  name: string;
  category: string;
  activeIngredient: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class Product extends Entity<Product, ProductProps> {
  private constructor(props: ProductProps) {
    super(props);
  }

  get name(): Name {
    return this.props.name;
  }

  get category(): ProductCategory {
    return this.props.category;
  }

  get activeIngredient(): ProductActiveIngredient {
    return this.props.activeIngredient;
  }

  public static tryCreate(props: ProductProps): Either<AppError, Product> {
    return makeRight(new Product(props));
  }

  public static fromPersistence(raw: ProductPersistenceRaw): Either<AppError, Product> {
    const idResult = Id.tryCreate(raw.id);
    if (isLeft(idResult)) return makeLeft(idResult.left);

    const nameResult = Name.tryCreate(raw.name);
    if (isLeft(nameResult)) return makeLeft(nameResult.left);

    const categoryResult = ProductCategory.tryCreate(raw.category);
    if (isLeft(categoryResult)) return makeLeft(categoryResult.left);

    const activeIngredientResult = ProductActiveIngredient.tryCreate(raw.activeIngredient);
    if (isLeft(activeIngredientResult)) return makeLeft(activeIngredientResult.left);

    return Product.tryCreate({
      id: idResult.right,
      name: nameResult.right,
      category: categoryResult.right,
      activeIngredient: activeIngredientResult.right,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt ?? null,
    });
  }
}
