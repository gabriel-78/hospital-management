import { AppError, Either, makeLeft, makeRight, ValueObject } from '@shared/core';

export class ProductActiveIngredient extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static tryCreate(value: string): Either<AppError, ProductActiveIngredient> {
    const trimmed = String(value ?? '').trim();
    if (!trimmed) {
      return makeLeft(new AppError('VALIDATION_ERROR', 'PRODUCT_ACTIVE_INGREDIENT_REQUIRED'));
    }
    if (trimmed.length > 255) {
      return makeLeft(new AppError('VALIDATION_ERROR', 'PRODUCT_ACTIVE_INGREDIENT_TOO_LONG'));
    }
    return makeRight(new ProductActiveIngredient(trimmed));
  }
}
