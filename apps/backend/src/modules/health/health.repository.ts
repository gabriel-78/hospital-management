import { prisma } from '@/infra/database/prisma';
import { AppError } from '@/shared/appError';
import { Either, makeLeft, makeRight } from '@/shared/either';

export class HealthRepository {
  async getStatus(): Promise<Either<AppError, unknown>> {
    const data = await prisma.healthCheck.findFirst();

    if (!data) {
      return makeLeft(
        new AppError(
          'UNEXPECTED',
          'Nenhum status de saúde encontrado',
          'No health status found in the database',
        ),
      );
    }

    return makeRight(data);
  }
}
