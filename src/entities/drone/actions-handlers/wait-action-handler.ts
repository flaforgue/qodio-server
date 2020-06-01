import BaseActionHandler from '../../shared/base-action-handler';
import Drone from '../drone';

export default class WaitActionHandler extends BaseActionHandler<Drone> {
  public handle(): boolean {
    this._entity.moveNearPosition(this._entity.hive.position, this._entity.hive.radius);
    return true;
  }
}
