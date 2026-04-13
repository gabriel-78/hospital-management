import { AppError, Either } from '@shared/core';
import { PharmaProduct } from './pharma.types.js';

export interface IPharmaGateway {
  findProductById(id: string): Promise<Either<AppError, PharmaProduct | null>>;
}
