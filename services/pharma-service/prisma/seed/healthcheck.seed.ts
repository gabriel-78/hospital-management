import { Prisma, PrismaClient } from '@prisma/client';

/**
 * @param prisma - Aceita tanto o cliente original quanto o contexto de transação
 */
export async function seedHealthCheck(prisma: Prisma.TransactionClient | PrismaClient) {
  const existing = await prisma.healthCheck.findFirst({
    where: {
      message: 'Initial health check seed',
    },
  });

  if (existing) {
    console.log('ℹ️ HealthCheck already seeded.');
    return;
  }

  await prisma.healthCheck.create({
    data: {
      message: 'Initial health check seed',
    },
  });

  console.log('✔ HealthCheck seeded.');
}
