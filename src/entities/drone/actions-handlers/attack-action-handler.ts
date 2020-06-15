import BaseActionHandler from '../../shared/base-action-handler';
import Drone from '../drone';
import config from '../../../config';
import { Attackable } from '../../../types';

export default class AttackActionHandler extends BaseActionHandler<Drone> {
  private _attackProgress = 0;
  private _attackTarget: Attackable;
  private readonly _attackRange = 120;
  private readonly _attackPerFrame = parseFloat((0.75 / config.fps).toFixed(2));
  private readonly _damagesPerAttack = 100;

  public get attackProgress(): number {
    return this._attackProgress;
  }

  public handle(): boolean {
    if (!this._attackTarget) {
      this._findAttackTarget();
    }

    if (!this._attackTarget) {
      return false;
    }

    if (this._entity.distanceFromTarget() <= this._attackRange) {
      this._attack();
    } else {
      this._entity.moveToTarget();
    }

    return true;
  }

  public reset(): void {
    super.reset();
    this._attackProgress = 0;
    this._attackTarget = null;
  }

  private _findAttackTarget(): void {
    this._attackTarget = this._entity.hive.player.ennemyHive;
    this._entity.target = this._attackTarget.position;
  }

  private _attack(): void {
    this._attackProgress += this._attackPerFrame;

    if (this._attackProgress >= 1) {
      this._attackProgress = 0;
      this._attackTarget.loseLife(this._damagesPerAttack);
    }
  }
}
