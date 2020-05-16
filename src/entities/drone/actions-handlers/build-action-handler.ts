import BaseActionHandler from '../../shared/base-action-handler';
import BuildingRequest from '../../hive/building-request';
import Drone from '../drone';

const buildingRange = 30;

export default class BuildActionHandler extends BaseActionHandler<Drone> {
  private _buildingRequest: BuildingRequest = null;
  private _buildingCapacity = 0.05;
  private _isBuilding = false;

  public reset(): void {
    this._isBuilding = false;
    this._buildingRequest = null;
  }

  public handle(): boolean {
    if (!this._buildingRequest) {
      this._buildingRequest = this._entity.hive.getNextBuildingRequest();
      return !!this._entity.hive.getNextBuildingRequest();
    }

    if (this._buildingRequest.progress >= 100) {
      return this._forgetBuildingRequest();
    }

    if (this._isBuilding) {
      return this._build();
    }

    if (!this._entity.target || !this._entity.target.isEqual(this._buildingRequest.position)) {
      this._entity.target = this._buildingRequest.position;
    }

    if (!this._entity.isNearFromTarget) {
      this._entity.moveToTarget();
    } else {
      this._isBuilding = true;
    }

    return true;
  }

  private _forgetBuildingRequest(): boolean {
    this._buildingRequest = null;
    this._entity.target = null;
    this._isBuilding = false;

    return true;
  }

  private _build(): boolean {
    this._entity.moveAroundPosition(this._buildingRequest.position, buildingRange);
    this._buildingRequest.addProgress(this._buildingCapacity);

    if (this._buildingRequest.progress >= 100) {
      this._entity.hive.addBuilding(this._buildingRequest);
    }

    return true;
  }
}
