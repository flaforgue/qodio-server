import PlayerEntity from './player-entity';
import Position from './position';
import { DroneAction, Axis } from '../types/qodio-api';
import Hive from './hive';
import { isNear, findTargetInCircle } from '../utils';

/*
 * Number of pixels a Drone can travel in one Tick
 * Increase it will decrease the impact of a low FPS but will add a twitch effect
 */
const STEP = 1;

export default class Drone extends PlayerEntity {
  private _action: DroneAction;
  private _target: Position;
  private readonly _hive: Hive;
  private readonly _resourceDetectionDistance = 10;

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
    if (!this._target || this._isOnTarget()) {
      this._target = this._findRandomTargetInTerritory();
    } else {
      this._lookForResource();
    }

    this._moveToTarget();
  }

  private _isOnTarget(): boolean {
    return isNear(this.position, this._target, STEP);
  }

  private _findTargetInHive(): Position {
    return findTargetInCircle(this._hive.position, this._hive.radius);
  }

  private _findRandomTargetInTerritory(): Position {
    return findTargetInCircle(this._hive.position, this._hive.territoryRadius);
  }

  private _moveToTarget(): void {
    const hasToMoveByX = this._hasToMoveBy('x');
    const hasToMoveByY = this._hasToMoveBy('y');

    if (hasToMoveByX && hasToMoveByY) {
      return Math.random() < 0.5 ? this._moveToTargetBy('x') : this._moveToTargetBy('y');
    } else if (hasToMoveByX) {
      return this._moveToTargetBy('x');
    } else {
      return this._moveToTargetBy('y');
    }
  }

  private _hasToMoveBy(axis: Axis): boolean {
    return this.position[axis] != this._target[axis];
  }

  private _moveToTargetBy(axis: Axis): void {
    if (this._position[axis] < this._target[axis]) {
      this._position[axis] += STEP;
    } else if (this._position[axis] > this._target[axis]) {
      this._position[axis] -= STEP;
    }
  }

  public _lookForResource(): void {
    const resources = this._hive.findResourcesIfPossible(
      this._position,
      this._resourceDetectionDistance,
    );

    if (resources.length) {
      this._hive.addKnownResources(resources);
    }
  }
}
