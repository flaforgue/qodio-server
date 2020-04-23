import BasePlayerEntity from '../shared/player-entity';
import Position from '../shared/position';
import { DroneAction, Direction } from '../../types';
import Hive from '../hive/hive';
import { WaitActionHandler } from './actions-handlers';
import { ScoutActionHandler } from './actions-handlers';
import { CollectActionHandler } from './actions-handlers';
import { BaseActionHandler } from './actions-handlers';
import config from '../../config';
import { BuildActionHandler } from './actions-handlers';
import { findPositionInCircle } from '../../utils';

export default class Drone extends BasePlayerEntity {
  private readonly _hive: Hive;
  private _target: Position;
  private _isNearFromTarget: boolean;
  private _direction: Direction;
  private _action: DroneAction;
  private _actionsHandlers: Record<DroneAction, BaseActionHandler>;

  public constructor(playerId: string, hive: Hive, action: DroneAction = 'wait') {
    super(playerId, hive.position);
    this._hive = hive;
    this._action = action;
    this._direction = 'up';

    this._actionsHandlers = {
      wait: new WaitActionHandler(this),
      scout: new ScoutActionHandler(this),
      collect: new CollectActionHandler(this),
      build: new BuildActionHandler(this),
    };
  }

  public get hive(): Hive {
    return this._hive;
  }

  public get action(): DroneAction {
    return this._action;
  }

  public set action(newAction: DroneAction) {
    this.target = null;
    this._actionsHandlers[this._action].reset();
    this._action = newAction;
  }

  public get direction(): Direction {
    return this._direction;
  }

  public get carriedResourceUnits(): number {
    return (this._actionsHandlers.collect as CollectActionHandler).carriedResourceUnits;
  }

  public get isNearFromTarget(): boolean {
    return this._isNearFromTarget;
  }

  public get target(): Position {
    return this._target;
  }

  public set target(position: Position) {
    this._target = position;
    this._isNearFromTarget = false;
  }

  public update(): void {
    switch (this._action) {
      case 'scout':
        this._actionsHandlers.scout.handle();
        break;
      case 'collect':
        this._actionsHandlers.collect.handle() || this._actionsHandlers.wait.handle();
        break;
      case 'build':
        this._actionsHandlers.build.handle() || this._actionsHandlers.wait.handle();
        break;
      case 'wait':
      default:
        this._actionsHandlers.wait.handle();
        break;
    }
  }

  public moveAroundPosition(position: Position, maxDistance: number): void {
    if (!this._target || this._isNearFromTarget) {
      this.target = findPositionInCircle(position, maxDistance);
    }

    this.moveToTarget();
  }

  public moveToTarget(): void {
    if (this._target) {
      this._isNearFromTarget = this.isNear(this._target, config.step);

      if (!this._isNearFromTarget) {
        this._direction = this._getMoveDirection();
        this._moveIntoDirection();
      }
    }
  }

  private _getMoveDirection(): Direction {
    let direction = '';

    if (this._position.y > this._target.y) {
      direction += 'up';
    } else if (this._position.y < this._target.y) {
      direction += 'down';
    }

    if (this._position.x > this._target.x) {
      direction += 'left';
    } else if (this._position.x < this._target.x) {
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
