import BaseActionHandler from './base-action-handler';
import Position from '../../shared/position';
import { findTargetInCircle } from '../../../utils';

export default class WaitActionHandler extends BaseActionHandler {
  public handle(): boolean {
    if (!this._drone.target || this._drone.isOnTarget()) {
      this._drone.target = this._findNewTargetInHive();
    }

    this._drone.moveToTarget();

    return true;
  }

  private _findNewTargetInHive(): Position {
    return findTargetInCircle(this._drone.hive.position, this._drone.hive.radius);
  }
}
