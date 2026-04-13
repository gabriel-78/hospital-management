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

export interface ConsultationResultProps extends EntityProps {
  consultationId: string;
  description: string;
}

export interface ConsultationResultPersistenceRaw {
  id: string;
  consultationId: string;
  description: string;
  createdAt: Date;
  deletedAt?: Date | null;
}

export class ConsultationResult extends Entity<ConsultationResult, ConsultationResultProps> {
  private constructor(props: ConsultationResultProps) {
    super(props);
  }

  get consultationId(): string {
    return this.props.consultationId;
  }

  get description(): string {
    return this.props.description;
  }

  public static tryCreate(props: ConsultationResultProps): Either<AppError, ConsultationResult> {
    return makeRight(new ConsultationResult(props));
  }

  public static fromPersistence(
    raw: ConsultationResultPersistenceRaw,
  ): Either<AppError, ConsultationResult> {
    const idResult = Id.tryCreate(raw.id);
    if (isLeft(idResult)) return makeLeft(idResult.left);

    return ConsultationResult.tryCreate({
      id: idResult.right,
      consultationId: raw.consultationId,
      description: raw.description,
      createdAt: raw.createdAt,
      deletedAt: raw.deletedAt ?? null,
    });
  }
}
