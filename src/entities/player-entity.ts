import Position from './position';
import BaseEntity from './base-entity';

export default class BasePlayerEntity extends BaseEntity {
  protected readonly playerId: string;

  public constructor(playerId: string, position: Position) {
    super(position);
    this.playerId = playerId;
  }
}
