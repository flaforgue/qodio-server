import BasePlayerEntity from '../shared/player-entity';
import Drone from '../drone/drone';
import Position from '../shared/position';
import { DroneAction } from '../../types';
import Resource from '../resource';
import Player from '../player';
import BuildingRequest from './building-request';
import { removeFromArrayById, randomFromArray, existsInArrayById } from '../../utils';

export default class Hive extends BasePlayerEntity {
  private _level = 1;
  private _stock = 100;
  private _drones: Drone[] = [];
  private readonly _player: Player;
  private _buildingRequests: BuildingRequest[] = [];
  private _knownResources: Resource[] = [];
  private _collectors: Resource[] = [];

  public constructor(player: Player, position: Position) {
    super(player.id, position);
    this._player = player;

    for (let i = 0; i < 1; i++) {
      this.addDrone('wait');
    }

    for (let i = 0; i < 5; i++) {
      this.addDrone('scout');
    }

    for (let i = 0; i < 20; i++) {
      this.addDrone('collect');
    }

    for (let i = 0; i < 5; i++) {
      this.addDrone('build');
    }
  }

  public get buildingRequests(): BuildingRequest[] {
    return this._buildingRequests;
  }

  public get knownResources(): Resource[] {
    return this._knownResources;
  }

  public get level(): number {
    return this._level;
  }

  public get collectors(): Resource[] {
    return this._collectors;
  }

  public get maxPopulation(): number {
    return 150 * this._level;
  }

  public get maxStock(): number {
    return 1000 * this._level;
  }

  public get radius(): number {
    return 75 + 12.5 * this._level;
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

  // Warning: the Hive is here considered as a square to improve performances
  public doesContainsPosition(position: Position): boolean {
    return (
      position.x > this._position.x - this.radius &&
      position.x < this._position.x + this.radius &&
      position.y > this._position.y - this.radius &&
      position.y < this._position.y + this.radius
    );
  }

  public addResourceUnits(amount: number): void {
    this._stock += amount;

    if (this._stock > this.maxStock) {
      this._stock = this.maxStock;
    }
  }

  public doesKnowResource(resourceId: string): boolean {
    return existsInArrayById(this._knownResources, resourceId);
  }

  public detectNewResourcesInRange(position: Position, detectionDistance: number): Resource[] {
    return this._player.game.board
      .detectResourcesIfPossible(position, detectionDistance)
      .filter((resource) => !this.doesKnowResource(resource.id));
  }

  public getNextBuildingRequest(): BuildingRequest | null {
    let pendingBuildingRequest = null;

    for (let i = 0; i < this._buildingRequests.length; i++) {
      if (this._buildingRequests[i].progress > 0 && this._buildingRequests[i].progress < 100) {
        return this._buildingRequests[i];
      } else if (!pendingBuildingRequest && this._buildingRequests[i].progress === 0) {
        pendingBuildingRequest = this._buildingRequests[i];
      }
    }

    return pendingBuildingRequest;
  }

  public getKnownResource(): Resource | null {
    return this._knownResources.length > 0 ? randomFromArray(this._knownResources) : null;
  }

  public getNonEmptyCollector(): Resource | null {
    const nonEmptyCollectors = this._collectors.filter((collector) => collector.stock > 0);
    return nonEmptyCollectors.length > 0 ? randomFromArray(nonEmptyCollectors) : null;
  }

  public addKnownResource(resource: Resource): void {
    if (!this.doesKnowResource(resource.id)) {
      this._player.game.removeResource(resource.id);
      this._knownResources.push(resource);

      // testing only
      setTimeout(() => {
        this._addBuildingRequest(resource);
      }, 2000);
    }
  }

  private _addBuildingRequest(knownResource: Resource): void {
    removeFromArrayById(this._knownResources, knownResource.id);
    this._buildingRequests.push(new BuildingRequest(knownResource));
  }

  public addBuilding(buildingRequest: BuildingRequest): void {
    removeFromArrayById(this._buildingRequests, buildingRequest.id);
    this._collectors.push(buildingRequest.resource);
  }
}
