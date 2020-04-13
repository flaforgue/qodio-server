import BasePlayerEntity from './shared/player-entity';
import Drone from './drone/drone';
import Position from './shared/position';
import { DroneAction } from '../types/qodio-server';
import Resource from './resource';
import Player from './player';

export default class Hive extends BasePlayerEntity {
  private _level = 1;
  private _stock = 0;
  private _drones: Drone[] = [];
  private readonly _player: Player;

  public constructor(player: Player, position: Position) {
    super(player.id, position);
    this._player = player;

    for (let i = 0; i < 50; i++) {
      this.addDrone('scout');
    }

    for (let i = 0; i < 50; i++) {
      this.addDrone('gather');
    }
  }

  public get level(): number {
    return this._level;
  }

  public get maxPopulation(): number {
    return 100 * this._level;
  }

  public get maxStock(): number {
    return 1000 * this._level;
  }

  public get radius(): number {
    return 150 + 25 * this._level;
  }

  public get territoryRadius(): number {
    return 1 * this._drones.length + 200;
  }

  public get stock(): number {
    return this._stock;
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

  public removeResource(resourceId: string): void {
    this._player.removeResource(resourceId);
  }

  public getKnownResource(): Resource | null {
    return this._player.getKnownResource();
  }

  public addResourceUnits(amount: number): void {
    this._stock += amount;

    if (this._stock > this.maxStock) {
      this._stock = this.maxStock;
    }
  }

  public doesKnowResource(resourceId: string): boolean {
    return this._player.doesKnowResource(resourceId);
  }

  // Warning: the Hive is here considered as a square to improve performances
  public containsPosition(position: Position): boolean {
    return (
      position.x > this._position.x - this.radius &&
      position.x < this._position.x + this.radius &&
      position.y > this._position.y - this.radius &&
      position.y < this._position.y + this.radius
    );
  }
}
