import { prisma } from '@/infra/database/prisma.js';
import { AppError, Either, makeLeft, makeRight } from '@shared/core';

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
