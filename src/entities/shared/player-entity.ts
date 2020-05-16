import Position from './position';
import BaseEntity from './base-entity';

export default class BasePlayerEntity extends BaseEntity {
  protected readonly _playerId: string;

  public constructor(playerId: string, position: Position) {
    super(position);
    this._playerId = playerId;
  }
}
