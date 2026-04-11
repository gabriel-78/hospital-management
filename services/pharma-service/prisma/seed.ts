import { pool, prisma } from '@/infra/database/prisma.js';
import { seedHealthCheck } from './seed/healthcheck.seed.js';

async function main() {
  try {
    console.log('🌱 Starting database seed...');

    await prisma.$transaction(async (tx) => {
      await seedHealthCheck(tx);
    });

    console.log('✅ Seed finalizado');
  } finally {
    await prisma.$disconnect();
    await pool.end(); // Importante para o processo do terminal fechar
  }
}

main();
