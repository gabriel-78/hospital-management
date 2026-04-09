import { CompanyType, Prisma, PrismaClient } from '@prisma/client';

const companies: Prisma.CompanyCreateInput[] = [
  {
    name: 'Hospital São Lucas',
    cnpj: '11222333000181',
    type: CompanyType.HOSPITAL,
    addressStreet: 'Avenida Paulista',
    addressNumber: '1000',
    addressComplement: 'Bloco A',
    addressNeighborhood: 'Bela Vista',
    addressCity: 'São Paulo',
    addressState: 'SP',
    addressZipCode: '01310100',
  },
  {
    name: 'Clínica Vida Plena',
    cnpj: '22333444000195',
    type: CompanyType.CLINIC,
    addressStreet: 'Rua das Flores',
    addressNumber: '250',
    addressNeighborhood: 'Centro',
    addressCity: 'Curitiba',
    addressState: 'PR',
    addressZipCode: '80010110',
  },
];

export async function seedCompanies(prisma: Prisma.TransactionClient | PrismaClient) {
  for (const company of companies) {
    await (prisma as PrismaClient).company.upsert({
      where: { cnpj: company.cnpj as string },
      update: {},
      create: company,
    });
  }

  console.log(`✔ Companies seeded (${companies.length} records).`);
}
