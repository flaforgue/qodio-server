import BaseActionHandler from '../../shared/base-action-handler';
import Drone from '../drone';
import { Position } from '../..';
import config from '../../../config';

export default class AttackActionHandler extends BaseActionHandler<Drone> {
  public ennemyHivePosition: Position;
  private _attackProgress = 0;
  private readonly _attackRange = 120;
  private readonly _attackPerFrame = parseFloat((1 / config.fps).toFixed(2));

  public constructor(drone: Drone, ennemyHivePosition?: Position) {
    super(drone);
    this.ennemyHivePosition = ennemyHivePosition;
  }

  public handle(): boolean {
    if (!this.ennemyHivePosition) {
      return false;
    }

    if (!this.ennemyHivePosition.isEqual(this._entity.target)) {
      this._entity.target = this.ennemyHivePosition;
    }

    if (this._entity.distanceFromTarget() <= this._attackRange) {
      this._attackTarget();
    } else {
      this._entity.moveToTarget();
    }

    return true;
  }

  public reset(): void {
    super.reset();
    this._attackProgress = 0;
  }

  private _attackTarget(): void {
    this._attackProgress += this._attackPerFrame;

    if (this._attackProgress >= 1) {
      console.log('attacking !');
      this._attackProgress = 0;
    }
  }
}
