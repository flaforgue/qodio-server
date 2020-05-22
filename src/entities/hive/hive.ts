import BasePlayerEntity from '../shared/player-entity';
import Drone from '../drone/drone';
import Position from '../shared/position';
import { DroneAction, HiveAction } from '../../types';
import Resource from '../resource';
import Player from '../player';
import BuildingRequest from './building-request';
import { removeFromArrayById, randomFromArray, existsInArrayById } from '../../utils';
import { droneActions } from '../../enums';
import { plainToClass } from 'class-transformer';
import ResourceDTO from '../../dtos/resource.dto';
import config from '../../config';

import {
  CreateDroneActionHandler,
  RecycleDroneActionHandler,
  BaseHiveActionHandler,
  UpgradeHiveActionHandler,
} from './actions-handlers';
import HiveDTO from '../../dtos/hive/hive.dto';

export default class Hive extends BasePlayerEntity {
  public actionsNbDrones: Record<DroneAction, number> = {
    wait: 0,
    scout: 0,
    collect: 0,
    build: 0,
    recycle: 0,
  };

  private _level = 1;
  private _action: HiveAction = 'wait';
  private _actionsHandlers: Record<HiveAction, BaseHiveActionHandler>;
  private _stock = config.hiveInitialResources;
  private _drones: Drone[] = [];
  private readonly _player: Player;
  private _buildingRequests: BuildingRequest[] = [];
  private _knownResources: Resource[] = [];
  private _collectors: Resource[] = [];

  public constructor(player: Player, position: Position) {
    super(player.id, position);
    this._player = player;
    this._actionsHandlers = {
      wait: new BaseHiveActionHandler(this),
      createDrone: new CreateDroneActionHandler(this),
      recycleDrone: new RecycleDroneActionHandler(this),
      upgradeHive: new UpgradeHiveActionHandler(this),
    };

    const initialDrones: { action: DroneAction; nbDrones: number }[] = [
      { action: 'wait', nbDrones: 5 },
      { action: 'scout', nbDrones: 0 },
      { action: 'collect', nbDrones: 0 },
      { action: 'build', nbDrones: 0 },
    ];

    for (let i = 0; i < initialDrones.length; i++) {
      for (let j = 0; j < initialDrones[i].nbDrones; j++) {
        this._drones.push(new Drone(this._playerId, this, initialDrones[i].action));
      }
    }
  }

  public get buildingRequests(): BuildingRequest[] {
    return this._buildingRequests;
  }

  public get knownResources(): Resource[] {
    return this._knownResources;
  }

  public get action(): HiveAction {
    return this._action;
  }

  public set action(newAction: HiveAction) {
    this._actionsHandlers[this._action].reset();
    this._action = newAction;
  }

  public get level(): number {
    return this._level;
  }

  public get collectors(): Resource[] {
    return this._collectors;
  }

  public get stock(): number {
    return this._stock;
  }

  public get drones(): Drone[] {
    return this._drones;
  }

  public get actionProgress(): number {
    return parseFloat(this._actionsHandlers[this._action].actionProgress.toFixed(1));
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

  public update(): void {
    for (let i = 0; i < droneActions.length; i++) {
      this.actionsNbDrones[droneActions[i]] = 0;
    }

    for (let i = 0; i < this.drones.length; i++) {
      this._drones[i].update();
      this.actionsNbDrones[this._drones[i].action]++;
    }

    this._actionsHandlers[this._action].handle();
  }

  public handleUpgradeHiveEvent(): void {
    if (
      this.action === 'wait' &&
      this._level < config.maxHiveLevel &&
      this._stock >= config.hiveUpgradeResourceCosts[this._level]
    ) {
      this.removeResourceUnits(config.hiveUpgradeResourceCosts[this._level]);
      this.action = 'upgradeHive';
    }
  }

  public upgrade(): void {
    this._level++;
    this._player.emitMessage('hive.upgraded', plainToClass(HiveDTO, this._player.hive));
  }

  public handleCreateDroneEvent(action?: DroneAction): void {
    const canCreateDrone =
      this._action === 'wait' &&
      this._drones.length < this.maxPopulation &&
      this.stock >= config.droneCreationResourceCost;

    if (canCreateDrone) {
      this.removeResourceUnits(config.droneCreationResourceCost);
      (this._actionsHandlers.createDrone as CreateDroneActionHandler).createdDroneAction = action;
      this.action = 'createDrone';
    }
  }

  public createDrone(action?: DroneAction): void {
    this._drones.push(new Drone(this._playerId, this, action));
    this._player.emitMessage('drone.created');
  }

  public handleRecycleDroneEvent(): void {
    const droneToRecycle = this._getEngagedDrone('wait');

    if (droneToRecycle) {
      droneToRecycle.action = 'recycle';
      (this._actionsHandlers
        .recycleDrone as RecycleDroneActionHandler).droneToRecycle = droneToRecycle;
      this.action = 'recycleDrone';
    }
  }

  public recycleDrone(droneToRecycle: Drone): void {
    removeFromArrayById(this._drones, droneToRecycle.id);
    this.addResourceUnits(config.droneCreationResourceCost);
    this._player.emitMessage('drone.recycled');
  }

  public handleEngageDroneEvent(action: DroneAction): void {
    const waitingDrone = this._getEngagedDrone('wait');
    if (waitingDrone) {
      waitingDrone.action = action;
      this._player.emitMessage('drone.engaged', action);
    }
  }

  public handleDisengageDroneEvent(action: DroneAction): void {
    const engagedDrone = this._getEngagedDrone(action);
    if (engagedDrone) {
      engagedDrone.action = 'wait';
      this._player.emitMessage('drone.disengaged', action);
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
      this._player.emitMessage('knownResource.created', plainToClass(ResourceDTO, resource));
    }
  }

  public handleBuildingRequestEvent(knownResourceId: string): void {
    if (this._stock >= config.buildingCreationResourceCost) {
      const knownResource = removeFromArrayById(this._knownResources, knownResourceId);
      if (knownResource) {
        this.removeResourceUnits(config.buildingCreationResourceCost);
        this._buildingRequests.push(new BuildingRequest(knownResource));
        this._player.emitMessage('building.created', knownResourceId);
      }
    }
  }

  public addBuilding(buildingRequest: BuildingRequest): void {
    removeFromArrayById(this._buildingRequests, buildingRequest.id);
    this._collectors.push(buildingRequest.resource);
  }
}
