import Drone from '../drone';

export default abstract class BaseActionHandler {
  public readonly _drone: Drone;

  public constructor(drone: Drone) {
    this._drone = drone;
  }

  public abstract handle(): boolean;
  public reset(): void {}
}
