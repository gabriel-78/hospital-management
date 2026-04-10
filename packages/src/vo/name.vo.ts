import { Either, isLeft, makeLeft, makeRight } from "../base/either.js";
import { AppError } from "../base/appError.js";
import { ValueObject, ValueObjectConfig } from "./base.js";

export class Name extends ValueObject<string, ValueObjectConfig> {
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 255;

  private constructor(value: string, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static create(value: string, config?: ValueObjectConfig): Name {
    const result = Name.tryCreate(value, config);
    if (isLeft(result)) throw result.left;
    return result.right;
  }

  public static tryCreate(
    value: string,
    config?: ValueObjectConfig,
  ): Either<AppError, Name> {
    const trimmed = String(value ?? "").trim();
    if (!trimmed) {
      return makeLeft(new AppError("VALIDATION_ERROR", "NAME_REQUIRED"));
    }
    if (trimmed.length < Name.MIN_LENGTH) {
      return makeLeft(new AppError("VALIDATION_ERROR", "NAME_TOO_SHORT"));
    }
    if (trimmed.length > Name.MAX_LENGTH) {
      return makeLeft(new AppError("VALIDATION_ERROR", "NAME_TOO_LONG"));
    }
    return makeRight(new Name(trimmed, config));
  }
}
