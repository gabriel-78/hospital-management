import { AppError } from '@/shared/appError';
import { HealthRepository } from './health.repository';
import { Either, isLeft, unwrapEither } from '@/shared/either';

export class HealthService {
  constructor(private repository: HealthRepository) {}

  async execute(): Promise<Either<AppError, unknown>> {
    const data = await this.repository.getStatus();

    if (isLeft(data)) {
      return data;
    }

    const result = unwrapEither(data);

    return {
      status: 'ok',
      database: true,
      message: result.message,
      timestamp: new Date().toISOString(),
    };
  }
}
