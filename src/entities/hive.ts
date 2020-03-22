import PlayerEntity from './player-entity';
import Drone from './drone';
import Position from './position';
import { DroneAction } from '../types/qodio-api';
import Resource from './resource';
import Player from './player';

export default class Hive extends PlayerEntity {
  private _level = 1;
  private _drones: Drone[] = [];
  private readonly _player: Player;

  public constructor(player: Player, position: Position) {
    super(player.id, position);
    this._player = player;
    this.addDrone();
    this.addDrone('scouting');
  }

  public get maxPopulation(): number {
    return 10 * this._level;
  }

  public get maxStock(): number {
    return 20 * this._level;
  }

  public get radius(): number {
    return 5 * this._level + 50;
  }

  public get territoryRadius(): number {
    return 20 * this._level + 200;
  }

  public get drones(): Drone[] {
    return this._drones;
  }

  public addDrone(action?: DroneAction): void {
    if (this._drones.length < this.maxPopulation) {
      this._drones.push(new Drone(this.playerId, this, action));
    }
  }

  public _findNewResourcesInRange(position: Position, detectionDistance: number): Resource[] {
    return this._player._findNewResourcesInRange(position, detectionDistance);
  }

  public addKnownResource(resource: Resource): void {
    this._player.addKnownResource(resource);
  }
}
