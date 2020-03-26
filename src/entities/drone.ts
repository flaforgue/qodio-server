import PlayerEntity from './player-entity';
import Position from './position';
import { DroneAction, Axis } from '../types/qodio-server';
import Hive from './hive';
import { findTargetInCircle, randomFromArray } from '../utils';
import Resource from './resource';

/*
 * Number of pixels a Drone can travel in one Tick
 * Increase it will decrease the impact of a low FPS but will add a twitch effect
 */
const STEP = 1;

export default class Drone extends PlayerEntity {
  private readonly _hive: Hive;

  private _action: DroneAction;
  private _target?: Position;
  private _detectedResource?: Resource;
  private _knownResource?: Resource;
  private _carriedResourceUnits = 0;

  private readonly _resourceDetectionRange = 30;
  private readonly _carryingCapacity = 10;

  public constructor(playerId: string, hive: Hive, action: DroneAction = 'waiting') {
    super(playerId, hive.position);
    this._hive = hive;
    this._action = action;
  }

  public get action(): DroneAction {
    return this._action;
  }

  public get carriedResourceUnits(): number {
    return this._carriedResourceUnits;
  }

  public update(): void {
    switch (this._action) {
      case 'scouting':
        this._updateScouting();
        break;
      case 'gathering':
        this._updateGathering();
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
    if (this._detectedResource && this._hive.doesKnowResource(this._detectedResource.id)) {
      this._detectedResource = null;
      this._target = null;
    }

    if (!this._target) {
      this._target = this._detectedResource?.position ?? this._findRandomTargetInTerritory();
    }

    if (this._isOnTarget()) {
      this._target = null;

      if (this._detectedResource) {
        this._hive.addKnownResource(this._detectedResource);
        this._detectedResource = null;
      }
    } else {
      this._moveToTarget();

      if (!this._detectedResource) {
        const detectedResources = this._detectNewResourcesInRange();
        const resource = detectedResources.length ? randomFromArray(detectedResources) : null;

        if (resource) {
          this._detectedResource = resource;
          this._target = resource.position;
        }
      }
    }
  }

  private _updateGathering(): void {
    if (!this._knownResource) {
      this._knownResource = this._getKnownResource();
    }

    if (this._knownResource) {
      if (this._knownResource.stock <= 0 && this._carriedResourceUnits === 0) {
        this._knownResource = null;
      } else {
        this._updateTargetIfGathering();
        this._moveToTarget();
        this._gatherOrStoreResource();
      }
    } else {
      if (this._target && !this._hive.containsPosition(this._target)) {
        this._target = null;
      }

      this._updateWaiting();
    }
  }

  private _gatherOrStoreResource(): void {
    const canGather = this._carriedResourceUnits === 0 && this.isNear(this._knownResource.position);
    if (canGather) {
      this._carriedResourceUnits = this._knownResource.provideResourceUnits(this._carryingCapacity);
      if (this._knownResource.stock <= 0) {
        this._hive.deleteKnownResource(this._knownResource.id);
      }
    } else if (this._carriedResourceUnits > 0 && this.isNear(this._hive.position)) {
      this._hive.addResourceUnits(this._carriedResourceUnits);
      this._carriedResourceUnits = 0;
    }
  }

  private _updateTargetIfGathering(): void {
    if (this._carriedResourceUnits === 0) {
      this._target = this._knownResource.position;
    } else {
      this._target = this._hive.position;
    }
  }

  private _isOnTarget(): boolean {
    return this._target ? this.isNear(this._target, STEP) : false;
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

  private _detectNewResourcesInRange(): Resource[] {
    return this._hive.detectNewResourcesInRange(this._position, this._resourceDetectionRange);
  }

  private _getKnownResource(): Resource | null {
    return this._hive.getKnownResource();
  }
}
