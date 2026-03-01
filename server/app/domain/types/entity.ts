import type { EntityId } from './entityId.js';

export abstract class Entity<Props> {
  readonly id: EntityId;
  protected readonly props: Props;

  constructor(id: EntityId, props: Props) {
    this.id = id;
    this.props = props;
  }

  equals(other: Entity<Props>): boolean {
    return this.id === other.id;
  }
}
