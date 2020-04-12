import BaseActionHandler from './base-action-handler';
import Resource from '../../resource';

export default class GatherActionHandler extends BaseActionHandler {
  private _knownResource?: Resource;
  private readonly _carryingCapacity = 1;
  private _carriedResourceUnits = 0;

  public get carriedResourceUnits(): number {
    return this._carriedResourceUnits;
  }

  public handle(): boolean {
    if (!this._knownResource) {
      this._knownResource = this._drone.hive.getKnownResource();
    }

    if (this._knownResource) {
      if (this._knownResource.stock <= 0 && this._carriedResourceUnits === 0) {
        this._knownResource = null;
      } else {
        this._updateTargetIfGathering();
        this._drone.moveToTarget();
        this._gatherOrStoreResource();
      }

      return true;
    } else {
      if (this._drone.target && !this._drone.hive.containsPosition(this._drone.target)) {
        this._drone.target = null;
      }

      return false;
    }
  }

  private _updateTargetIfGathering(): void {
    if (this._carriedResourceUnits === 0) {
      this._drone.target = this._knownResource.position;
    } else {
      this._drone.target = this._drone.hive.position;
    }
  }

  private _gatherOrStoreResource(): void {
    if (!this._carriedResourceUnits && this._drone.isNear(this._knownResource.position)) {
      this._gatherResource();
    } else if (this._carriedResourceUnits && this._drone.isNear(this._drone.hive.position)) {
      this._storeResource();
    }
  }

  private _gatherResource(): void {
    this._carriedResourceUnits = this._knownResource.provideResourceUnits(this._carryingCapacity);

    if (this._knownResource.stock <= 0) {
      this._drone.hive.deleteKnownResource(this._knownResource.id);
    }
  }

  private _storeResource(): void {
    this._drone.hive.addResourceUnits(this._carriedResourceUnits);
    this._carriedResourceUnits = 0;
  }
}
