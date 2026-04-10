import { Company as PrismaCompany, CompanyType as PrismaCompanyType } from '@prisma/client';
import { Either, AppError } from '@shared/core';
import { Company } from '../company.domain.js';

export class CompanyMapper {
  static toDomain(raw: PrismaCompany): Either<AppError, Company> {
    return Company.fromPersistence({
      id: raw.id,
      name: raw.name,
      cnpj: raw.cnpj,
      type: raw.type as string,
      addressStreet: raw.addressStreet,
      addressNumber: raw.addressNumber,
      addressComplement: raw.addressComplement,
      addressNeighborhood: raw.addressNeighborhood,
      addressCity: raw.addressCity,
      addressState: raw.addressState,
      addressZipCode: raw.addressZipCode,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toPersistence(company: Company) {
    return {
      id: company.id.value,
      name: company.name.value,
      cnpj: company.cnpj.value,
      type: company.type.value as PrismaCompanyType,
      addressStreet: company.address.value.street,
      addressNumber: company.address.value.number,
      addressComplement: company.address.value.complement ?? null,
      addressNeighborhood: company.address.value.neighborhood,
      addressCity: company.address.value.city,
      addressState: company.address.value.state,
      addressZipCode: company.address.value.zipCode,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      deletedAt: company.deletedAt,
    };
  }
}
