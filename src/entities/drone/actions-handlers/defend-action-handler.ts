import BaseActionHandler from '../../shared/base-action-handler';
import Drone from '../drone';
import Position from '../../shared/position';

export default class DefendActionHandler extends BaseActionHandler<Drone> {
  private _distanceFromHive = 150;
  private _currentPointIndex = 0;
  private _targetPoints = [];

  public constructor(entity: Drone) {
    super(entity);

    this._targetPoints = [
      new Position(
        this._entity.hive.position.x + 50,
        this._entity.hive.position.y - this._distanceFromHive,
      ),
      new Position(
        this._entity.hive.position.x + this._distanceFromHive / 2 + 50,
        this._entity.hive.position.y - this._distanceFromHive / 2,
      ),
      new Position(
        this._entity.hive.position.x + this._distanceFromHive,
        this._entity.hive.position.y + 50,
      ),
      new Position(
        this._entity.hive.position.x + this._distanceFromHive / 2,
        this._entity.hive.position.y + this._distanceFromHive / 2 + 50,
      ),
      new Position(
        this._entity.hive.position.x - 50,
        this._entity.hive.position.y + this._distanceFromHive,
      ),

      new Position(
        this._entity.hive.position.x - this._distanceFromHive / 2 - 50,
        this._entity.hive.position.y + this._distanceFromHive / 2,
      ),
      new Position(
        this._entity.hive.position.x - this._distanceFromHive,
        this._entity.hive.position.y - 50,
      ),
      new Position(
        this._entity.hive.position.x - this._distanceFromHive / 2 - 50,
        this._entity.hive.position.y - this._distanceFromHive / 2,
      ),
    ];
  }

  public handle(): boolean {
    this.moveAroundHive();
    return true;
  }

  public moveAroundHive(): void {
    if (!this._entity.target) {
      this._currentPointIndex = Math.floor(Math.random() * this._targetPoints.length);
      this._entity.target = this._targetPoints[this._currentPointIndex];
    }

    if (this._entity.isNearFromTarget) {
      this._currentPointIndex = (this._currentPointIndex + 1) % this._targetPoints.length;
      this._entity.target = this._targetPoints[this._currentPointIndex];
    }

    this._entity.moveToTarget();
  }
}
