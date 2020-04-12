import BaseActionHandler from './base-action-handler';

export default class WaitActionHandler extends BaseActionHandler {
  public handle(): boolean {
    if (!this._drone.target || this._drone.isOnTarget()) {
      this._drone.target = this._drone.findTargetInHive();
    }

    this._drone.moveToTarget();

    return true;
  }
}
