import { Either, isLeft, makeLeft, makeRight } from '../../shared/either';
import { AppError } from '../../shared/appError';
import { Entity, EntityProps } from '../../shared/entity';
import { Id } from '../../shared/vo/id.vo';
import { Name } from '../../shared/vo/name.vo';
import { Cnpj } from '../../shared/vo/cnpj.vo';
import { Address } from '../../shared/vo/address.vo';
import { CompanyType } from '../../shared/vo/company-type.vo';

export interface CompanyProps extends EntityProps {
  name: Name;
  cnpj: Cnpj;
  address: Address;
  type: CompanyType;
}

export interface CompanyPersistenceRaw {
  id: string;
  name: string;
  cnpj: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement?: string | null;
  addressNeighborhood: string;
  addressCity: string;
  addressState: string;
  addressZipCode: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class Company extends Entity<Company, CompanyProps> {
  private constructor(props: CompanyProps) {
    super(props);
  }

  get name(): Name {
    return this.props.name;
  }

  get cnpj(): Cnpj {
    return this.props.cnpj;
  }

  get address(): Address {
    return this.props.address;
  }

  get type(): CompanyType {
    return this.props.type;
  }

  public static tryCreate(props: CompanyProps): Either<AppError, Company> {
    return makeRight(new Company(props));
  }

  public static fromPersistence(raw: CompanyPersistenceRaw): Either<AppError, Company> {
    const idResult = Id.tryCreate(raw.id);
    if (isLeft(idResult)) return makeLeft(idResult.left);

    const nameResult = Name.tryCreate(raw.name);
    if (isLeft(nameResult)) return makeLeft(nameResult.left);

    const cnpjResult = Cnpj.tryCreate(raw.cnpj);
    if (isLeft(cnpjResult)) return makeLeft(cnpjResult.left);

    const addressResult = Address.tryCreate({
      street: raw.addressStreet,
      number: raw.addressNumber,
      complement: raw.addressComplement ?? undefined,
      neighborhood: raw.addressNeighborhood,
      city: raw.addressCity,
      state: raw.addressState,
      zipCode: raw.addressZipCode,
    });
    if (isLeft(addressResult)) return makeLeft(addressResult.left);

    const typeResult = CompanyType.tryCreate(raw.type);
    if (isLeft(typeResult)) return makeLeft(typeResult.left);

    return Company.tryCreate({
      id: idResult.right,
      name: nameResult.right,
      cnpj: cnpjResult.right,
      address: addressResult.right,
      type: typeResult.right,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt ?? null,
    });
  }
}
