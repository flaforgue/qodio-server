import BasePlayerEntity from '../player-entity';
import Position from '../position';
import { DroneAction, Direction, DroneActionHandler } from '../../types/qodio-server';
import Hive from '../hive';
import { findTargetInCircle } from '../../utils';
import WaitActionHandler from './actions-handlers/wait-action-handler';
import ScoutActionHandler from './actions-handlers/scout-action-handler';
import GatherActionHandler from './actions-handlers/gather-action-handler';

/*
 * Number of pixels a Drone can travel in one Tick
 * Increase it will decrease the impact of a low FPS but will add a twitch effect
 * Never really tested, use it carefully
 */
const STEP = 1;

export default class Drone extends BasePlayerEntity {
  public target?: Position;
  public carriedResourceUnits = 0;

  private readonly _hive: Hive;
  private _direction: Direction;
  private _action: DroneAction;
  private _actionsHandlers: {
    [K in DroneAction]: DroneActionHandler;
  };

  public constructor(playerId: string, hive: Hive, action: DroneAction = 'wait') {
    super(playerId, hive.position);
    this._hive = hive;
    this._action = action;
    this._actionsHandlers.wait = new WaitActionHandler(this).handle;
    this._actionsHandlers.scout = new ScoutActionHandler(this).handle;
    this._actionsHandlers.gather = new GatherActionHandler(this).handle;
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

  public update(): void {
    switch (this._action) {
      case 'scout':
        this._actionsHandlers.scout();
        break;
      case 'gather':
        this._actionsHandlers.gather() || this._actionsHandlers.wait();
        break;
      case 'wait':
      default:
        this._actionsHandlers.wait();
        break;
    }
  }

  public isOnTarget(): boolean {
    return this.target ? this.isNear(this.target, STEP) : false;
  }

  public findTargetInHive(): Position {
    return findTargetInCircle(this.hive.position, this.hive.radius);
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
    let isMovingUpOrDown = true;

    if (this._position.y > this.target.y) {
      direction += 'up';
    } else if (this._position.y < this.target.y) {
      direction += 'down';
    } else {
      isMovingUpOrDown = false;
    }

    if (this._position.x > this.target.x) {
      // Be sure to move if not moving up or down, randomly move in diagonal when needed
      if (!isMovingUpOrDown || Math.random() < 0.5) {
        direction += 'left';
      }
    } else if (this._position.x < this.target.x) {
      // Be sure to move if not moving up or down, randomly move in diagonal when needed
      if (!isMovingUpOrDown || Math.random() < 0.5) {
        direction += 'right';
      }
    }

    return direction as Direction;
  }

  private _moveIntoDirection(): void {
    switch (this._direction) {
      case 'up':
        this._position.y -= STEP;
        break;
      case 'upright':
        this._position.y -= STEP / 2;
        this._position.x += STEP / 2;
        break;
      case 'right':
        this._position.x += STEP;
        break;
      case 'downright':
        this._position.y += STEP / 2;
        this._position.x += STEP / 2;
        break;
      case 'down':
        this._position.y += STEP;
        break;
      case 'downleft':
        this._position.y += STEP / 2;
        this._position.x -= STEP / 2;
        break;
      case 'left':
        this._position.x -= STEP;
        break;
      case 'upleft':
        this._position.y -= STEP / 2;
        this._position.x -= STEP / 2;
        break;
      default:
        break;
    }
  }
}
