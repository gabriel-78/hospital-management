import { PrismaClient } from '@prisma/client';

const patients = [
  { name: 'João Pedro Alves' },
  { name: 'Maria Clara Souza' },
  { name: 'Lucas Ferreira Santos' },
  { name: 'Beatriz Oliveira Lima' },
  { name: 'Rafael Costa Nunes' },
];

export async function seedPatients(prisma: PrismaClient) {
  for (const patient of patients) {
    await prisma.patient.create({ data: patient });
  }

  console.log(`✔ Patients seeded (${patients.length} records).`);
}
