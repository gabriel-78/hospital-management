import { Either, isLeft, makeLeft } from '@/shared/either';
import { AppError } from '@/shared/appError';
import { Name } from '@/shared/vo/name.vo';
import { Address, AddressProps } from '@/shared/vo/address.vo';
import { ICompanyRepository } from '../infra/company.repository';
import { Company } from '../company.domain';

export interface UpdateCompanyDTO {
  name?: string;
  address?: AddressProps;
}

export class UpdateCompanyUseCase {
  constructor(private repository: ICompanyRepository) {}

  async execute(id: string, dto: UpdateCompanyDTO): Promise<Either<AppError, Company>> {
    const findResult = await this.repository.findById(id);
    if (isLeft(findResult)) return makeLeft(findResult.left);
    if (findResult.right === null) {
      return makeLeft(new AppError('NOT_FOUND', 'COMPANY_NOT_FOUND'));
    }

    const existing = findResult.right;
    let name = existing.name;
    let address = existing.address;

    if (dto.name !== undefined) {
      const nameResult = Name.tryCreate(dto.name);
      if (isLeft(nameResult)) return makeLeft(nameResult.left);
      name = nameResult.right;
    }

    if (dto.address !== undefined) {
      const addressResult = Address.tryCreate(dto.address);
      if (isLeft(addressResult)) return makeLeft(addressResult.left);
      address = addressResult.right;
    }

    const updatedResult = Company.tryCreate({
      ...existing.props,
      name,
      address,
      updatedAt: new Date(),
    });
    if (isLeft(updatedResult)) return makeLeft(updatedResult.left);

    return this.repository.save(updatedResult.right);
  }
}
