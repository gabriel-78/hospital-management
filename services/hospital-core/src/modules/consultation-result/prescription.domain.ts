import {
  AppError,
  Either,
  Entity,
  EntityProps,
  Id,
  isLeft,
  makeLeft,
  makeRight,
} from '@shared/core';

export interface PrescriptionProps extends EntityProps {
  consultationResultId: string;
}

export interface PrescriptionPersistenceRaw {
  id: string;
  consultationResultId: string;
  createdAt: Date;
  deletedAt?: Date | null;
}

export class Prescription extends Entity<Prescription, PrescriptionProps> {
  private constructor(props: PrescriptionProps) {
    super(props);
  }

  get consultationResultId(): string {
    return this.props.consultationResultId;
  }

  public static tryCreate(props: PrescriptionProps): Either<AppError, Prescription> {
    return makeRight(new Prescription(props));
  }

  public static fromPersistence(raw: PrescriptionPersistenceRaw): Either<AppError, Prescription> {
    const idResult = Id.tryCreate(raw.id);
    if (isLeft(idResult)) return makeLeft(idResult.left);

    return Prescription.tryCreate({
      id: idResult.right,
      consultationResultId: raw.consultationResultId,
      createdAt: raw.createdAt,
      deletedAt: raw.deletedAt ?? null,
    });
  }
}
