import PlayerEntity from './player-entity';
import Drone from './drone';
import Position from './position';
import { DroneAction } from '../types/qodio-server';
import Resource from './resource';
import Player from './player';

export default class Hive extends PlayerEntity {
  private _level = 1;
  private _resourceUnits = 0;
  private _drones: Drone[] = [];
  // todo: make private
  public readonly _player: Player;

  public constructor(player: Player, position: Position) {
    super(player.id, position);
    this._player = player;
    this.addDrone();
    this.addDrone('scouting');
    this.addDrone('gathering');
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

  public detectNewResourcesInRange(position: Position, detectionDistance: number): Resource[] {
    return this._player._detectNewResourcesInRange(position, detectionDistance);
  }

  public addKnownResource(resource: Resource): void {
    this._player.addKnownResource(resource);
  }

  public removeKnownResource(resourceId: string): void {
    this._player.removeKnownResource(resourceId);
  }

  public getKnownResource(): Resource | null {
    return this._player.getKnownResource();
  }

  public addResourceUnits(amount: number): void {
    this._resourceUnits = +amount;

    if (this._resourceUnits > this.maxStock) {
      this._resourceUnits = this.maxStock;
    }
  }

  public doesKnowResource(resource: Resource): boolean {
    return this._player.doesKnowResource(resource);
  }

  /*
   * Be careful using this method
   * This check the position in a square, not in a cirlce
   * Performances are more important than precision
   */
  public containsPosition(position: Position): boolean {
    return (
      position.x > this._position.x - this.radius &&
      position.x < this._position.x + this.radius &&
      position.y > this._position.y - this.radius &&
      position.y < this._position.y + this.radius
    );
  }
}
