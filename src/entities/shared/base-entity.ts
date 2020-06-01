import Position from './position';
import { isNear } from '../../utils';
import { v4 as uuidv4 } from 'uuid';
import config from '../../config';

export default class BaseEntity {
  public readonly id: string;
  protected _position: Position;

  public constructor(position: Position) {
    this.id = uuidv4();
    this._position = new Position(position.x, position.y);
  }

  public get position(): Position {
    return this._position;
  }

  public isNear(target: Position, precision = config.speed): boolean {
    return isNear(this._position, target, precision);
  }
}
