import Position from './position';
import { v1 as uuidv1 } from 'uuid';
import { isNear } from '../utils';

export default class Entity {
  protected _position: Position;
  public readonly id: string;

  public constructor(position: Position) {
    this.id = uuidv1();
    this._position = { ...position };
  }

  public get position(): Position {
    return this._position;
  }

  public isNear(target: Position, precision = 0): boolean {
    return isNear(this._position, target, precision);
  }
}
