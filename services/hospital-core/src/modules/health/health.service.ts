import { AppError, Either, isLeft, makeRight, unwrapEither } from '@shared/core';
import { HealthRepository } from './health.repository.js';

export class HealthService {
  constructor(private repository: HealthRepository) {}

  async execute(): Promise<Either<AppError, unknown>> {
    const data = await this.repository.getStatus();

    if (isLeft(data)) {
      return data;
    }

    const result = unwrapEither(data);

    return makeRight({
      status: 'ok',
      database: true,
      message: result.message,
      timestamp: new Date().toISOString(),
    });
  }
}
