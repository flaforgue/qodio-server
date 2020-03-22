import PlayerEntity from './player-entity';
import Position from './position';
import { DroneAction, Axis } from '../types/qodio-api';
import Hive from './hive';
import { isNear, findTargetInCircle } from '../utils';
import Resource from './resource';

/*
 * Number of pixels a Drone can travel in one Tick
 * Increase it will decrease the impact of a low FPS but will add a twitch effect
 */
const STEP = 1;

export default class Drone extends PlayerEntity {
  private _action: DroneAction;
  private _target?: Position;
  private _knownResource?: Resource;
  private readonly _hive: Hive;
  private readonly _resourceDetectionDistance = 30;

  public constructor(playerId: string, hive: Hive, action: DroneAction = 'waiting') {
    super(playerId, hive.position);
    this._hive = hive;
    this._action = action;
  }

  public get action(): DroneAction {
    return this._action;
  }

  public update(): void {
    switch (this._action) {
      case 'scouting':
        this._updateScouting();
        break;
      case 'waiting':
      default:
        this._updateWaiting();
        break;
    }
  }

  private _updateWaiting(): void {
    if (!this._target || this._isOnTarget()) {
      this._target = this._findTargetInHive();
    }

    this._moveToTarget();
  }

  private _updateScouting(): void {
    if (this._isOnTarget()) {
      this._target = null;

      if (this._knownResource) {
        this._hive.addKnownResource(this._knownResource);
        this._knownResource = null;
      }
    } else {
      if (!this._target) {
        this._target = this._knownResource?.position ?? this._findRandomTargetInTerritory();
      } else {
        const resources = this._findNewResourcesInRange();

        if (resources.length) {
          this._knownResource = resources[0];
          this._target = resources[0].position;
        }

        this._moveToTarget();
      }
    }
  }

  private _isOnTarget(): boolean {
    return this._target ? isNear(this.position, this._target, STEP) : false;
  }

  private _findTargetInHive(): Position {
    return findTargetInCircle(this._hive.position, this._hive.radius);
  }

  private _findRandomTargetInTerritory(): Position {
    return findTargetInCircle(this._hive.position, this._hive.territoryRadius);
  }

  private _moveToTarget(): void {
    const hasToMoveByX = this._hasToMoveToTargetBy('x');
    const hasToMoveByY = this._hasToMoveToTargetBy('y');

    if (hasToMoveByX && hasToMoveByY) {
      return Math.random() < 0.5 ? this._moveToTargetBy('x') : this._moveToTargetBy('y');
    } else if (hasToMoveByX) {
      return this._moveToTargetBy('x');
    } else {
      return this._moveToTargetBy('y');
    }
  }

  private _hasToMoveToTargetBy(axis: Axis): boolean {
    return this._target ? this.position[axis] != this._target[axis] : false;
  }

  private _moveToTargetBy(axis: Axis): void {
    if (this._target) {
      if (this._position[axis] < this._target[axis]) {
        this._position[axis] += STEP;
      } else if (this._position[axis] > this._target[axis]) {
        this._position[axis] -= STEP;
      }
    }
  }

  public _findNewResourcesInRange(): Resource[] {
    return this._hive._findNewResourcesInRange(this._position, this._resourceDetectionDistance);
  }
}
