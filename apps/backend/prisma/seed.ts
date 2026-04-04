import { pool, prisma } from '@/infra/database/prisma';
import { seedHealthCheck } from './seed/healthcheck.seed';
import { seedCompanies } from './seed/company.seed';

async function main() {
  try {
    console.log('🌱 Starting database seed...');

    await prisma.$transaction(async (tx) => {
      await seedHealthCheck(tx);
    });

    await seedCompanies(prisma);

    console.log('✅ Seed finalizado');
  } finally {
    await prisma.$disconnect();
    await pool.end(); // Importante para o processo do terminal fechar
  }
}

main();
