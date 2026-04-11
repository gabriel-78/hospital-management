import {
  AppError,
  CRM,
  Either,
  Entity,
  EntityProps,
  Id,
  isLeft,
  makeLeft,
  makeRight,
  Name,
} from '@shared/core';

export interface DoctorProps extends EntityProps {
  name: Name;
  crm: CRM;
}

export interface DoctorPersistenceRaw {
  id: string;
  name: string;
  crm: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class Doctor extends Entity<Doctor, DoctorProps> {
  private constructor(props: DoctorProps) {
    super(props);
  }

  get name(): Name {
    return this.props.name;
  }

  get crm(): CRM {
    return this.props.crm;
  }

  public static tryCreate(props: DoctorProps): Either<AppError, Doctor> {
    return makeRight(new Doctor(props));
  }

  public static fromPersistence(raw: DoctorPersistenceRaw): Either<AppError, Doctor> {
    const idResult = Id.tryCreate(raw.id);
    if (isLeft(idResult)) return makeLeft(idResult.left);

    const nameResult = Name.tryCreate(raw.name);
    if (isLeft(nameResult)) return makeLeft(nameResult.left);

    const crmResult = CRM.tryCreate(raw.crm);
    if (isLeft(crmResult)) return makeLeft(crmResult.left);

    return Doctor.tryCreate({
      id: idResult.right,
      name: nameResult.right,
      crm: crmResult.right,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt ?? null,
    });
  }
}
