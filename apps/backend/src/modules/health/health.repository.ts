import { prisma } from '@/infra/database/prisma';

export class HealthRepository {
  async getStatus() {
    return await prisma.healthCheck.findFirst();
  }
}
