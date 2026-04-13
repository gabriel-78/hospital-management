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

export interface PrescriptionItemProps extends EntityProps {
  prescriptionId: string;
  remedyId?: string | null;
  medication: string;
  dosage: string;
  duration: string;
  instructions?: string | null;
}

export interface PrescriptionItemPersistenceRaw {
  id: string;
  prescriptionId: string;
  remedyId?: string | null;
  medication: string;
  dosage: string;
  duration: string;
  instructions?: string | null;
}

export class PrescriptionItem extends Entity<PrescriptionItem, PrescriptionItemProps> {
  private constructor(props: PrescriptionItemProps) {
    super(props);
  }

  get prescriptionId(): string {
    return this.props.prescriptionId;
  }

  get medication(): string {
    return this.props.medication;
  }

  get dosage(): string {
    return this.props.dosage;
  }

  get duration(): string {
    return this.props.duration;
  }

  get remedyId(): string | null {
    return this.props.remedyId ?? null;
  }

  get instructions(): string | null {
    return this.props.instructions ?? null;
  }

  public static tryCreate(props: PrescriptionItemProps): Either<AppError, PrescriptionItem> {
    return makeRight(new PrescriptionItem(props));
  }

  public static fromPersistence(
    raw: PrescriptionItemPersistenceRaw,
  ): Either<AppError, PrescriptionItem> {
    const idResult = Id.tryCreate(raw.id);
    if (isLeft(idResult)) return makeLeft(idResult.left);

    return PrescriptionItem.tryCreate({
      id: idResult.right,
      prescriptionId: raw.prescriptionId,
      remedyId: raw.remedyId ?? null,
      medication: raw.medication,
      dosage: raw.dosage,
      duration: raw.duration,
      instructions: raw.instructions ?? null,
    });
  }
}
