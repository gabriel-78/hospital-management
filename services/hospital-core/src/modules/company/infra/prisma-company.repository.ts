import { prisma } from '@/infra/database/prisma.js';
import { Either, isLeft, makeLeft, makeRight, AppError } from '@shared/core';
import { Company } from '../company.domain.js';
import { ICompanyRepository } from './company.repository.js';
import { CompanyMapper } from './company.mapper.js';

export class PrismaCompanyRepository implements ICompanyRepository {
  async create(company: Company): Promise<Either<AppError, Company>> {
    const data = CompanyMapper.toPersistence(company);
    const raw = await prisma.company.create({ data });
    return CompanyMapper.toDomain(raw);
  }

  async findById(id: string): Promise<Either<AppError, Company | null>> {
    const raw = await prisma.company.findFirst({
      where: { id, deletedAt: null },
    });
    if (!raw) return makeRight(null);
    return CompanyMapper.toDomain(raw);
  }

  async findByCnpj(cnpj: string): Promise<Either<AppError, Company | null>> {
    const raw = await prisma.company.findFirst({
      where: { cnpj, deletedAt: null },
    });
    if (!raw) return makeRight(null);
    return CompanyMapper.toDomain(raw);
  }

  async list(): Promise<Either<AppError, Company[]>> {
    const raws = await prisma.company.findMany({
      where: { deletedAt: null },
    });

    const companies: Company[] = [];
    for (const raw of raws) {
      const result = CompanyMapper.toDomain(raw);
      if (isLeft(result)) return makeLeft(result.left);
      companies.push(result.right);
    }

    return makeRight(companies);
  }

  async save(company: Company): Promise<Either<AppError, Company>> {
    const data = CompanyMapper.toPersistence(company);
    const raw = await prisma.company.update({
      where: { id: data.id },
      data,
    });
    return CompanyMapper.toDomain(raw);
  }

  async softDelete(id: string): Promise<Either<AppError, void>> {
    await prisma.company.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return makeRight(undefined);
  }
}
