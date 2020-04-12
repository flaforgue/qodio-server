import Position from './position';
import { v4 as uuidv4 } from 'uuid';
import { isNear } from '../../utils';

export default class BaseEntity {
  protected _position: Position;
  public readonly id: string;

  public constructor(position: Position) {
    this.id = uuidv4();
    this._position = { ...position };
  }

  public get position(): Position {
    return this._position;
  }

  public isNear(target: Position, precision = 1): boolean {
    return isNear(this._position, target, precision);
  }
}
