import Position from './position';
import Entity from './entity';

export default class PlayerEntity extends Entity {
  protected readonly playerId: string;

  public constructor(playerId: string, position: Position) {
    super(position);

    this.playerId = playerId;
  }
}
