import BaseActionHandler from './base-action-handler';
import BuildingRequest from '../../hive/building-request';

const buildingRange = 30;

export default class BuildActionHandler extends BaseActionHandler {
  private _buildingRequest: BuildingRequest = null;
  private _buildingCapacity = 0.05;
  private _isBuilding = false;

  public reset(): void {
    this._isBuilding = false;
    this._buildingRequest = null;
  }

  public handle(): boolean {
    if (!this._buildingRequest) {
      this._buildingRequest = this._drone.hive.getNextBuildingRequest();
      return !!this._drone.hive.getNextBuildingRequest();
    }

    if (this._buildingRequest.progress >= 100) {
      return this._forgetBuildingRequest();
    }

    if (this._isBuilding) {
      return this._build();
    }

    if (!this._drone.target || !this._drone.target.isEqual(this._buildingRequest.position)) {
      this._drone.target = this._buildingRequest.position;
    }

    if (!this._drone.isNearFromTarget) {
      this._drone.moveToTarget();
    } else {
      this._isBuilding = true;
    }

    return true;
  }

  private _forgetBuildingRequest(): boolean {
    this._buildingRequest = null;
    this._drone.target = null;
    this._isBuilding = false;

    return true;
  }

  private _build(): boolean {
    this._drone.moveAroundPosition(this._buildingRequest.position, buildingRange);
    this._buildingRequest.addProgress(this._buildingCapacity);

    if (this._buildingRequest.progress >= 100) {
      this._drone.hive.addBuilding(this._buildingRequest);
    }

    return true;
  }
}
