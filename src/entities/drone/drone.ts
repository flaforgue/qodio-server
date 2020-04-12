import BasePlayerEntity from '../shared/player-entity';
import Position from '../shared/position';
import { DroneAction, Direction } from '../../types/qodio-server';
import Hive from '../hive';
import WaitActionHandler from './actions-handlers/wait-action-handler';
import ScoutActionHandler from './actions-handlers/scout-action-handler';
import GatherActionHandler from './actions-handlers/gather-action-handler';
import BaseActionHandler from './actions-handlers/base-action-handler';
import config from '../../config';

export default class Drone extends BasePlayerEntity {
  public target?: Position;
  private readonly _hive: Hive;
  private _direction: Direction;
  private _action: DroneAction;
  private _actionsHandlers: Record<DroneAction, BaseActionHandler>;

  public constructor(playerId: string, hive: Hive, action: DroneAction = 'wait') {
    super(playerId, hive.position);
    this._hive = hive;
    this._action = action;

    this._actionsHandlers = {
      wait: new WaitActionHandler(this),
      scout: new ScoutActionHandler(this),
      gather: new GatherActionHandler(this),
    };
  }

  public get hive(): Hive {
    return this._hive;
  }

  public get action(): DroneAction {
    return this._action;
  }

  public get direction(): Direction {
    return this._direction;
  }

  public get carriedResourceUnits(): number {
    return (this._actionsHandlers.gather as GatherActionHandler).carriedResourceUnits;
  }

  public update(): void {
    switch (this._action) {
      case 'scout':
        this._actionsHandlers.scout.handle();
        break;
      case 'gather':
        this._actionsHandlers.gather.handle() || this._actionsHandlers.wait.handle();
        break;
      case 'wait':
      default:
        this._actionsHandlers.wait.handle();
        break;
    }
  }

  public isOnTarget(): boolean {
    return this.target ? this.isNear(this.target, config.step) : false;
  }

  public moveToTarget(): void {
    const moveDirection = this._getMoveDirection();

    if (moveDirection) {
      this._direction = moveDirection;
      this._moveIntoDirection();
    }
  }

  private _getMoveDirection(): Direction {
    let direction = '';

    if (this._position.y > this.target.y) {
      direction += 'up';
    } else if (this._position.y < this.target.y) {
      direction += 'down';
    }

    if (this._position.x > this.target.x) {
      direction += 'left';
    } else if (this._position.x < this.target.x) {
      direction += 'right';
    }

    return direction as Direction;
  }

  private _moveIntoDirection(): void {
    switch (this._direction) {
      case 'up':
        this._position.y -= config.step;
        break;
      case 'upright':
        this._position.y -= config.step / 2;
        this._position.x += config.step / 2;
        break;
      case 'right':
        this._position.x += config.step;
        break;
      case 'downright':
        this._position.y += config.step / 2;
        this._position.x += config.step / 2;
        break;
      case 'down':
        this._position.y += config.step;
        break;
      case 'downleft':
        this._position.y += config.step / 2;
        this._position.x -= config.step / 2;
        break;
      case 'left':
        this._position.x -= config.step;
        break;
      case 'upleft':
        this._position.y -= config.step / 2;
        this._position.x -= config.step / 2;
        break;
      default:
        break;
    }
  }
}
