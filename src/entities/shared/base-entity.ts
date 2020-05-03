import Position from './position';
import { isNear } from '../../utils';
import IdEntity from './id-entity';

export default class BaseEntity extends IdEntity {
  protected _position: Position;

  public constructor(position: Position) {
    super();
    this._position = new Position(position.x, position.y);
  }

  public get position(): Position {
    return this._position;
  }

  public isNear(target: Position, precision = 1): boolean {
    return isNear(this._position, target, precision);
  }
}
