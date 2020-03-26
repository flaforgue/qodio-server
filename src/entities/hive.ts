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
  private readonly _player: Player;

  public constructor(player: Player, position: Position) {
    super(player.id, position);
    this._player = player;
    this.addDrone();

    for (let i = 0; i < 100; i++) {
      this.addDrone('scouting');
    }

    for (let i = 0; i < 100; i++) {
      this.addDrone('gathering');
    }
  }

  public get maxPopulation(): number {
    return 10000 * this._level;
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
    return this._player.detectNewResourcesInRange(position, detectionDistance);
  }

  public addKnownResource(resource: Resource): void {
    this._player.addKnownResource(resource);
  }

  public deleteKnownResource(resourceId: string): void {
    this._player.deleteKnownResource(resourceId);
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

  public doesKnowResource(resourceId: string): boolean {
    return this._player.doesKnowResource(resourceId);
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
