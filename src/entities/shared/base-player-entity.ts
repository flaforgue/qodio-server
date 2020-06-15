import Position from './position';
import BaseEntity from './base-entity';
import { Attackable } from '../../types';

export default abstract class BasePlayerEntity extends BaseEntity implements Attackable {
  protected readonly _playerId: string;
  private _life: number;
  private _maxLife: number;

  public constructor(playerId: string, position: Position, maxLife?: number) {
    super(position);
    this._maxLife = maxLife;
    this._life = maxLife;
    this._playerId = playerId;
  }

  public get life(): number {
    return this._life;
  }

  public get maxLife(): number {
    return this._maxLife;
  }

  public set maxLife(newValue: number) {
    const delta = newValue - this._maxLife;
    this._life += delta;
    this._maxLife = newValue;
  }

  public loseLife(amount: number): void {
    if (this._life > 0) {
      this._life -= amount;
      if (this._life <= 0) {
        this.die();
      }
    }
  }

  public abstract die(): void;
}
