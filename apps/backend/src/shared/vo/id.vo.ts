import { v4 as uuidv4 } from 'uuid';
import { Either, isLeft, makeLeft, makeRight } from '../either';
import { AppError } from '../appError';
import { ValueObject, ValueObjectConfig } from './base';

export class Id extends ValueObject<string, ValueObjectConfig> {
  private static readonly INVALID_ID = 'INVALID_ID';
  private static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  private constructor(value: string, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static create(value?: string, config?: ValueObjectConfig): Id {
    const result = Id.tryCreate(value, config);
    if (isLeft(result)) throw result.left;
    return result.right;
  }

  public static tryCreate(value?: string, config?: ValueObjectConfig): Either<AppError, Id> {
    const hasValue = value !== undefined && value !== null && value !== '';
    const idValue = hasValue ? value!.trim().toLowerCase() : uuidv4();
    if (!Id.UUID_REGEX.test(idValue)) {
      return makeLeft(new AppError('VALIDATION_ERROR', Id.INVALID_ID));
    }
    return makeRight(new Id(idValue, config));
  }
}
