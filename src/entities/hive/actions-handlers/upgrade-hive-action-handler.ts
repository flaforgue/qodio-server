import BaseHiveActionHandler from './base-hive-action-handler';
import config from '../../../config';

export default class UpgradeHiveActionHandler extends BaseHiveActionHandler {
  protected readonly _productivity = (100 / config.fps / 10) * config.hiveProductivity;

  protected _terminateAction(): void {
    this._entity.upgrade();
  }
}
