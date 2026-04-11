import { pool, prisma } from '@/infra/database/prisma.js';
import { seedHealthCheck } from './seed/healthcheck.seed.js';
import { seedCompanies } from './seed/company.seed.js';
import { seedDoctors } from './seed/doctor.seed.js';

async function main() {
  try {
    console.log('🌱 Starting database seed...');

    await prisma.$transaction(async (tx) => {
      await seedHealthCheck(tx);
    });

    await seedCompanies(prisma);
    await seedDoctors(prisma);

    console.log('✅ Seed finalizado');
  } finally {
    await prisma.$disconnect();
    await pool.end(); // Importante para o processo do terminal fechar
  }
}

main();
