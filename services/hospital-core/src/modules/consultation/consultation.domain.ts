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

export enum ConsultationStatusEnum {
  SCHEDULED = 'SCHEDULED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface ConsultationProps extends EntityProps {
  doctorId: string;
  patientId: string;
  scheduledAt: Date;
  status: ConsultationStatusEnum;
}

export interface ConsultationPersistenceRaw {
  id: string;
  doctorId: string;
  patientId: string;
  scheduledAt: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class Consultation extends Entity<Consultation, ConsultationProps> {
  private constructor(props: ConsultationProps) {
    super(props);
  }

  get doctorId(): string {
    return this.props.doctorId;
  }

  get patientId(): string {
    return this.props.patientId;
  }

  get scheduledAt(): Date {
    return this.props.scheduledAt;
  }

  get status(): ConsultationStatusEnum {
    return this.props.status;
  }

  get isCancelled(): boolean {
    return this.props.status === ConsultationStatusEnum.CANCELLED;
  }

  get isCompleted(): boolean {
    return this.props.status === ConsultationStatusEnum.COMPLETED;
  }

  get isScheduled(): boolean {
    return this.props.status === ConsultationStatusEnum.SCHEDULED;
  }

  get canBeCancelled(): Either<AppError, void> {
    if (this.isCancelled) {
      return makeLeft(new AppError('DOMAIN_ERROR', 'CONSULTATION_ALREADY_CANCELLED'));
    }

    if (this.isCompleted) {
      return makeLeft(new AppError('DOMAIN_ERROR', 'CONSULTATION_COMPLETED_CANNOT_BE_CANCELLED'));
    }

    return makeRight(undefined);
  }

  get canBeCompleted(): Either<AppError, void> {
    if (this.isCancelled) {
      return makeLeft(new AppError('DOMAIN_ERROR', 'CONSULTATION_CANCELLED_CANNOT_BE_COMPLETED'));
    }

    if (this.isCompleted) {
      return makeLeft(new AppError('DOMAIN_ERROR', 'CONSULTATION_ALREADY_COMPLETED'));
    }

    if (this.scheduledAt > new Date()) {
      return makeLeft(
        new AppError('DOMAIN_ERROR', 'CONSULTATION_CANNOT_BE_COMPLETED_BEFORE_SCHEDULED_TIME'),
      );
    }

    return makeRight(undefined);
  }

  public canBeRescheduled(value: Date): Either<AppError, void> {
    if (this.isCompleted) {
      return makeLeft(new AppError('DOMAIN_ERROR', 'CONSULTATION_COMPLETED_CANNOT_BE_ALTERED'));
    }

    if (this.isCancelled) {
      return makeLeft(new AppError('DOMAIN_ERROR', 'CONSULTATION_CANCELLED_CANNOT_BE_ALTERED'));
    }

    if (value <= new Date()) {
      return makeLeft(new AppError('DOMAIN_ERROR', 'CONSULTATION_SCHEDULED_AT_MUST_BE_FUTURE'));
    }

    return makeRight(undefined);
  }

  public static tryCreate(props: ConsultationProps): Either<AppError, Consultation> {
    return makeRight(new Consultation(props));
  }

  public static fromPersistence(raw: ConsultationPersistenceRaw): Either<AppError, Consultation> {
    const idResult = Id.tryCreate(raw.id);
    if (isLeft(idResult)) return makeLeft(idResult.left);

    const validStatuses = Object.values(ConsultationStatusEnum) as string[];
    if (!validStatuses.includes(raw.status)) {
      return makeLeft(new AppError('VALIDATION_ERROR', 'CONSULTATION_STATUS_INVALID'));
    }

    return Consultation.tryCreate({
      id: idResult.right,
      doctorId: raw.doctorId,
      patientId: raw.patientId,
      scheduledAt: raw.scheduledAt,
      status: raw.status as ConsultationStatusEnum,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt ?? null,
    });
  }
}
