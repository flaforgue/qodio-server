import BaseActionHandler from '../../shared/base-action-handler';
import Resource from '../../resource';
import Drone from '../drone';

export default class CollectActionHandler extends BaseActionHandler<Drone> {
  private _targetedCollector: Resource;
  private readonly _carryingCapacity = 1;
  private _carriedResourceUnits = 0;

  public reset(): void {
    this._targetedCollector = null;
  }

  public get carriedResourceUnits(): number {
    return this._carriedResourceUnits;
  }

  public handle(): boolean {
    if (!this._targetedCollector) {
      this._targetedCollector = this._entity.hive.getNonEmptyCollector();
    }

    if (this._targetedCollector) {
      if (this._targetedCollector.stock <= 0 && this._carriedResourceUnits === 0) {
        this._targetedCollector = null;
      } else {
        this._updateTargetIfCollecting();
        this._entity.moveToTarget();
        this._collectOrStoreResource();
      }

      return true;
    } else {
      if (this._entity.target && !this._entity.hive.doesContainsPosition(this._entity.target)) {
        this._entity.target = null;
      }

      return false;
    }
  }

  private _updateTargetIfCollecting(): void {
    if (this._carriedResourceUnits === 0) {
      this._entity.target = this._targetedCollector.position;
    } else {
      this._entity.target = this._entity.hive.position;
    }
  }

  private _collectOrStoreResource(): void {
    if (this._entity.isNearFromTarget) {
      if (!this._carriedResourceUnits) {
        this._collectResource();
      } else if (this._carriedResourceUnits) {
        this._storeResource();
      }
    }
  }

  private _collectResource(): void {
    this._carriedResourceUnits = this._targetedCollector.provideResourceUnits(
      this._carryingCapacity,
    );
  }

  private _storeResource(): void {
    this._entity.hive.addResourceUnits(this._carriedResourceUnits);
    this._carriedResourceUnits = 0;
  }
}
