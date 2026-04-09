import { Either, isLeft, makeLeft } from '@/shared/either';
import { AppError } from '@/shared/appError';
import { Name } from '@/shared/vo/name.vo';
import { Cnpj } from '@/shared/vo/cnpj.vo';
import { Address, AddressProps } from '@/shared/vo/address.vo';
import { CompanyType } from '@/shared/vo/company-type.vo';
import { ICompanyRepository } from '../infra/company.repository';
import { Company } from '../company.domain';

export interface CreateCompanyDTO {
  name: string;
  cnpj: string;
  type: string;
  address: AddressProps;
}

export class CreateCompanyUseCase {
  constructor(private repository: ICompanyRepository) {}

  async execute(dto: CreateCompanyDTO): Promise<Either<AppError, Company>> {
    const existingResult = await this.repository.findByCnpj(dto.cnpj);
    if (isLeft(existingResult)) return makeLeft(existingResult.left);
    if (existingResult.right !== null) {
      return makeLeft(new AppError('DOMAIN_ERROR', 'CNPJ_ALREADY_EXISTS'));
    }

    const nameResult = Name.tryCreate(dto.name);
    if (isLeft(nameResult)) return makeLeft(nameResult.left);

    const cnpjResult = Cnpj.tryCreate(dto.cnpj);
    if (isLeft(cnpjResult)) return makeLeft(cnpjResult.left);

    const addressResult = Address.tryCreate(dto.address);
    if (isLeft(addressResult)) return makeLeft(addressResult.left);

    const typeResult = CompanyType.tryCreate(dto.type);
    if (isLeft(typeResult)) return makeLeft(typeResult.left);

    const companyResult = Company.tryCreate({
      name: nameResult.right,
      cnpj: cnpjResult.right,
      address: addressResult.right,
      type: typeResult.right,
    });
    if (isLeft(companyResult)) return makeLeft(companyResult.left);

    return this.repository.create(companyResult.right);
  }
}
