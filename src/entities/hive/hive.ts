import BasePlayerEntity from '../shared/player-entity';
import Drone from '../drone/drone';
import Position from '../shared/position';
import { DroneAction } from '../../types';
import Resource from '../resource';
import Player from '../player';
import BuildingRequest from './building-request';
import { removeFromArrayById, randomFromArray, existsInArrayById } from '../../utils';
import { droneActions } from '../../enums';

const droneResourceCost = 10;
const buildingResourceCost = 30;

export default class Hive extends BasePlayerEntity {
  public actionsNbDrones: Record<DroneAction, number> = {
    wait: 0,
    scout: 0,
    collect: 0,
    build: 0,
  };

  private _level = 1;
  private _stock = 100;
  private _drones: Drone[] = [];
  private readonly _player: Player;
  private _buildingRequests: BuildingRequest[] = [];
  private _knownResources: Resource[] = [];
  private _collectors: Resource[] = [];
  private _nbResourcesDiscovered = 0;

  public constructor(player: Player, position: Position) {
    super(player.id, position);
    this._player = player;

    const initialDrones: { action: DroneAction; nbDrones: number }[] = [
      { action: 'wait', nbDrones: 10 },
      { action: 'scout', nbDrones: 0 },
      { action: 'collect', nbDrones: 0 },
      { action: 'build', nbDrones: 0 },
    ];

    for (let i = 0; i < initialDrones.length; i++) {
      for (let j = 0; j < initialDrones[i].nbDrones; j++) {
        this._drones.push(new Drone(this.playerId, this, initialDrones[i].action));
      }
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

  public get nbResourcesDiscovered(): number {
    return this._nbResourcesDiscovered;
  }

  public get maxPopulation(): number {
    return 50 * this._level;
  }

  public get maxStock(): number {
    return 1000 * this._level;
  }

  public get radius(): number {
    return Math.floor(75 + 12.5 * this._level);
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

  public update(): void {
    for (let i = 0; i < droneActions.length; i++) {
      this.actionsNbDrones[droneActions[i]] = 0;
    }

    for (let i = 0; i < this.drones.length; i++) {
      this._drones[i].update();
      this.actionsNbDrones[this._drones[i].action]++;
    }
  }

  public addDrone(action?: DroneAction): void {
    if (this._drones.length < this.maxPopulation && this.stock >= droneResourceCost) {
      this.removeResourceUnits(droneResourceCost);
      this._drones.push(new Drone(this.playerId, this, action));
    }
  }

  public recycleDrone(): void {
    const droneToRecycle = this._getEngagedDrone('wait');

    if (droneToRecycle) {
      removeFromArrayById(this._drones, droneToRecycle.id);
      this.addResourceUnits(droneResourceCost);
    }
  }

  public engageDrone(action: DroneAction): void {
    const waitingDrone = this._getEngagedDrone('wait');
    if (waitingDrone) {
      waitingDrone.action = action;
    }
  }

  public disengageDrone(action: DroneAction): void {
    const engagedDrone = this._getEngagedDrone(action);
    if (engagedDrone) {
      engagedDrone.action = 'wait';
    }
  }

  private _getEngagedDrone(action: DroneAction): Drone | null {
    for (let i = 0; i < this._drones.length; i++) {
      if (this._drones[i].action === action) {
        return this._drones[i];
      }
    }

    return null;
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

    if (this._stock < 0) {
      this._stock = 0;
    }
  }

  public removeResourceUnits(amount: number): void {
    this.addResourceUnits(amount * -1);
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
      this._nbResourcesDiscovered++;
    }
  }

  public addBuildingRequest(knownResourceId: string): void {
    const knownResource = removeFromArrayById(this._knownResources, knownResourceId);
    if (knownResource && this._stock >= buildingResourceCost) {
      this.removeResourceUnits(buildingResourceCost);
      this._buildingRequests.push(new BuildingRequest(knownResource));
    }
  }

  public addBuilding(buildingRequest: BuildingRequest): void {
    removeFromArrayById(this._buildingRequests, buildingRequest.id);
    this._collectors.push(buildingRequest.resource);
  }
}
