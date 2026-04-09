import { Either } from './either';
import { AppError } from './appError';
import { Id } from './vo/id.vo';

export interface EntityProps {
  id?: Id;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export abstract class Entity<Type, Props extends EntityProps> {
  readonly props: Props;
  readonly id: Id;

  protected constructor(props: Props) {
    const id = props.id ?? Id.create();
    this.id = id;
    this.props = {
      ...props,
      id,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
      deletedAt: props.deletedAt ?? null,
    };
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt ?? null;
  }

  equals(entity: Entity<Type, Props>): boolean {
    return this.id.equals(entity.id);
  }

  notEquals(entity: Entity<Type, Props>): boolean {
    return this.id.notEquals(entity.id);
  }

  public cloneWith(overrides: Partial<Props>): Either<AppError, Type> {
    const merged = this.deepMerge(structuredClone(this.props), overrides);
    return (this.constructor as any).tryCreate(merged);
  }

  private deepMerge(target: any, source: any): any {
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        this.deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  toJSON() {
    return this.props;
  }
}
