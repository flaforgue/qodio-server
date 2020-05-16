import { DroneAction } from '../../../types';
import BaseHiveActionHandler from './base-hive-action-handler';
import config from '../../../config';

export default class CreateDroneActionHandler extends BaseHiveActionHandler {
  protected readonly _productivity = (100 / config.fps / 5) * config.hiveProductivity;
  public createdDroneAction: DroneAction;

  protected _terminateAction(): void {
    this._entity.createDrone(this.createdDroneAction);
  }

  public reset(): void {
    super.reset();
    this.createdDroneAction = undefined;
  }
}
