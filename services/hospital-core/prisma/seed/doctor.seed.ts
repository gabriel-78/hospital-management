import { PrismaClient } from '@prisma/client';

const doctors = [
  { name: 'Ana Paula Ferreira', crm: '123456-SP' },
  { name: 'Carlos Eduardo Mendes', crm: '987654-RJ' },
  { name: 'Fernanda Lima', crm: '456789-MG' },
  { name: 'Ricardo Souza', crm: '321654-BA' },
  { name: 'Juliana Costa', crm: '654321-CE' },
];

export async function seedDoctors(prisma: PrismaClient) {
  for (const doctor of doctors) {
    await prisma.doctor.upsert({
      where: { crm: doctor.crm },
      update: {},
      create: doctor,
    });
  }

  console.log(`✔ Doctors seeded (${doctors.length} records).`);
}
