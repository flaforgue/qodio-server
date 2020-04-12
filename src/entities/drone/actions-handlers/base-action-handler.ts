import Drone from '../drone';
import { DroneActionHandler } from '../../../types/qodio-server';

export default abstract class BaseActionHandler {
  protected readonly _drone: Drone;
  protected _handle: DroneActionHandler;

  public constructor(drone: Drone) {
    this._drone = drone;
  }
}
