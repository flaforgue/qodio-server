import BaseActionHandler from './base-action-handler';

export default class WaitActionHandler extends BaseActionHandler {
  public handle(): boolean {
    this._drone.moveAroundPosition(this._drone.hive.position, this._drone.hive.radius);
    return true;
  }
}
