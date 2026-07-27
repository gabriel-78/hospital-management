import { Id } from "../vo/id.vo.js";

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

  toJSON() {
    return this.props;
  }
}
