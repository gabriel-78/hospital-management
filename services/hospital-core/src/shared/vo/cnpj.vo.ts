import { Either, isLeft, makeLeft, makeRight } from '../either';
import { AppError } from '../appError';
import { ValueObject, ValueObjectConfig } from './base';

export class Cnpj extends ValueObject<string, ValueObjectConfig> {
  private static readonly CNPJ_LENGTH = 14;

  private constructor(value: string, config?: ValueObjectConfig) {
    super(value, config);
  }

  public static create(value: string, config?: ValueObjectConfig): Cnpj {
    const result = Cnpj.tryCreate(value, config);
    if (isLeft(result)) throw result.left;
    return result.right;
  }

  public static tryCreate(value: string, config?: ValueObjectConfig): Either<AppError, Cnpj> {
    const digits = String(value ?? '').replace(/\D/g, '');
    if (digits.length !== Cnpj.CNPJ_LENGTH) {
      return makeLeft(new AppError('VALIDATION_ERROR', 'INVALID_CNPJ'));
    }
    if (!/^\d{14}$/.test(digits)) {
      return makeLeft(new AppError('VALIDATION_ERROR', 'INVALID_CNPJ'));
    }
    if (/^(\d)\1{13}$/.test(digits)) {
      return makeLeft(new AppError('VALIDATION_ERROR', 'INVALID_CNPJ'));
    }
    return makeRight(new Cnpj(digits, config));
  }

  get formatted(): string {
    const v = this.value;
    return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8, 12)}-${v.slice(12)}`;
  }

  public static format(value: string): string {
    const digits = String(value ?? '').replace(/\D/g, '');
    if (digits.length !== 14) return value;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
  }
}
