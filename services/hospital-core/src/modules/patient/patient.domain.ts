import {
  AppError,
  Either,
  Entity,
  EntityProps,
  Id,
  isLeft,
  makeLeft,
  makeRight,
  Name,
} from '@shared/core';

export interface PatientProps extends EntityProps {
  name: Name;
}

export interface PatientPersistenceRaw {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class Patient extends Entity<Patient, PatientProps> {
  private constructor(props: PatientProps) {
    super(props);
  }

  get name(): Name {
    return this.props.name;
  }

  public static tryCreate(props: PatientProps): Either<AppError, Patient> {
    return makeRight(new Patient(props));
  }

  public static fromPersistence(raw: PatientPersistenceRaw): Either<AppError, Patient> {
    const idResult = Id.tryCreate(raw.id);
    if (isLeft(idResult)) return makeLeft(idResult.left);

    const nameResult = Name.tryCreate(raw.name);
    if (isLeft(nameResult)) return makeLeft(nameResult.left);

    return Patient.tryCreate({
      id: idResult.right,
      name: nameResult.right,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt ?? null,
    });
  }
}
