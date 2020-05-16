import BaseHiveActionHandler from './base-hive-action-handler';
import config from '../../../config';

export default class UpgradeHiveActionHandler extends BaseHiveActionHandler {
  protected readonly _speed = 100 / (3 * config.fps);

  protected _terminateAction(): void {
    this._entity.upgrade();
  }
}
