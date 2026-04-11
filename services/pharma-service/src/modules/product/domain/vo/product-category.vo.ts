import { AppError, Either, makeLeft, makeRight, ValueObject } from '@shared/core';

export class ProductCategory extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static tryCreate(value: string): Either<AppError, ProductCategory> {
    const trimmed = String(value ?? '').trim();
    if (!trimmed) {
      return makeLeft(new AppError('VALIDATION_ERROR', 'PRODUCT_CATEGORY_REQUIRED'));
    }
    if (trimmed.length > 100) {
      return makeLeft(new AppError('VALIDATION_ERROR', 'PRODUCT_CATEGORY_TOO_LONG'));
    }
    return makeRight(new ProductCategory(trimmed));
  }
}
