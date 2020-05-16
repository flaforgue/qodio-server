import BaseActionHandler from '../../shared/base-action-handler';
import Hive from '../hive';
import config from '../../../config';

export default class BaseHiveActionHandler extends BaseActionHandler<Hive> {
  protected readonly _speed = 1 / config.fps;
  protected _actionProgress = 0;

  public get actionProgress(): number {
    return this._actionProgress;
  }

  public handle(): boolean {
    this._actionProgress += this._speed;

    if (this._actionProgress >= 100) {
      this._terminateAction();
      this._entity.action = 'wait'; // action setter will call this.reset()
    }

    return true;
  }

  protected _terminateAction(): void {}

  public reset(): void {
    this._actionProgress = 0;
  }
}
