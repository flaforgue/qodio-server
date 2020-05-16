import { DroneAction } from '../../../types';
import BaseHiveActionHandler from './base-hive-action-handler';
import config from '../../../config';

export default class CreateDroneActionHandler extends BaseHiveActionHandler {
  protected readonly _speed = 100 / (1 * config.fps);
  public createdDroneAction: DroneAction;

  protected _terminateAction(): void {
    this._entity.createDrone(this.createdDroneAction);
  }

  public reset(): void {
    super.reset();
    this.createdDroneAction = undefined;
  }
}
