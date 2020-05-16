import Drone from '../../drone/drone';
import BaseHiveActionHandler from './base-hive-action-handler';
import config from '../../../config';

export default class RecycleDroneActionHandler extends BaseHiveActionHandler {
  protected readonly _productivity = (100 / config.fps / 3) * config.hiveProductivity;
  public droneToRecycle: Drone;

  protected _terminateAction(): void {
    this._entity.recycleDrone(this.droneToRecycle);
  }

  public reset(): void {
    super.reset();
    this.droneToRecycle = null;
  }
}
