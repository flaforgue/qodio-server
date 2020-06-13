import BasePlayerEntity from '../shared/player-entity';
import Position from '../shared/position';
import { DroneAction, Direction } from '../../types';
import Hive from '../hive/hive';
import {
  BuildActionHandler,
  ScoutActionHandler,
  CollectActionHandler,
  WaitActionHandler,
  DefendActionHandler,
  AttackActionHandler,
} from './actions-handlers';
import BaseActionHandler from '../shared/base-action-handler';
import config from '../../config';
import { findPositionInCircle } from '../../utils';

export default class Drone extends BasePlayerEntity {
  private readonly _hive: Hive;
  private _target: Position;
  private _isNearFromTarget: boolean;
  private _direction: Direction;
  private _action: DroneAction;
  private _actionsHandlers: Record<DroneAction, BaseActionHandler<Drone>>;

  public constructor(
    playerId: string,
    hive: Hive,
    ennemyHivePosition: Position,
    action: DroneAction = 'wait',
  ) {
    super(playerId, hive.position);
    this._hive = hive;
    this._action = action;
    this._direction = 'up';

    this._actionsHandlers = {
      wait: new WaitActionHandler(this),
      recycle: new WaitActionHandler(this), // acts like a waiting drone but cannot be engaged
      scout: new ScoutActionHandler(this),
      collect: new CollectActionHandler(this),
      build: new BuildActionHandler(this),
      defend: new DefendActionHandler(this),
      attack: new AttackActionHandler(this, ennemyHivePosition),
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

  public get attackProgress(): number {
    return (this._actionsHandlers.attack as AttackActionHandler).attackProgress;
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
      case 'wait':
      case 'scout':
      case 'defend':
        this._actionsHandlers[this._action].handle();
        break;
      case 'attack':
        this._actionsHandlers[this._action].handle() || this._actionsHandlers.defend.handle();
        break;
      case 'build':
      case 'collect':
        this._actionsHandlers[this._action].handle() || this._actionsHandlers.wait.handle();
        break;
      default:
        this._actionsHandlers.wait.handle();
        break;
    }
  }

  public moveNearPosition(position: Position, maxDistance: number): void {
    if (!this._target || this._isNearFromTarget) {
      this.target = findPositionInCircle(position, maxDistance);
    }

    this.moveToTarget();
  }

  public moveToTarget(): void {
    if (this._target) {
      this._isNearFromTarget = this.isNear(this._target);

      if (!this._isNearFromTarget) {
        this._direction = this._getMoveDirection();
        this._moveToDirection();
      }
    }
  }

  public distanceFromTarget(): number {
    return this._target ? this._position.distanceFrom(this._target) : 0;
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

  private _moveToDirection(): void {
    switch (this._direction) {
      case 'up':
        this._position.y -= config.speed;
        break;
      case 'upright':
        this._position.y -= config.speed / 2;
        this._position.x += config.speed / 2;
        break;
      case 'right':
        this._position.x += config.speed;
        break;
      case 'downright':
        this._position.y += config.speed / 2;
        this._position.x += config.speed / 2;
        break;
      case 'down':
        this._position.y += config.speed;
        break;
      case 'downleft':
        this._position.y += config.speed / 2;
        this._position.x -= config.speed / 2;
        break;
      case 'left':
        this._position.x -= config.speed;
        break;
      case 'upleft':
        this._position.y -= config.speed / 2;
        this._position.x -= config.speed / 2;
        break;
      default:
        break;
    }
  }

  public updateEnnemyHivePosition(position: Position): void {
    (this._actionsHandlers.attack as AttackActionHandler).ennemyHivePosition = position;
  }
}
