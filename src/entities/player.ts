import Hive from './hive/hive';
import Position from './shared/position';
import { v4 as uuidv4 } from 'uuid';
import Game from './game';
import { WorkerAction, WarriorAction } from '../types';

export default class Player {
  public readonly game: Game;
  public readonly hive: Hive;
  public readonly id: string;
  private readonly _socketId: string;
  public ennemyHive: Hive;

  public constructor(game: Game, socketId: string, position: Position) {
    this.id = uuidv4();
    this.game = game;
    this._socketId = socketId;
    this.hive = new Hive(this, position);
  }

  public emitMessage(name: string, data?: unknown): void {
    this.game.emitMessage(this._socketId, name, data);
  }

  public handleCreateDroneEvent(action: WorkerAction): void {
    this.hive.handleCreateDroneEvent(action);
  }

  public handleCreateWarriorEvent(action: WarriorAction): void {
    this.hive.handleCreateWarriorEvent(action);
  }

  public handleRecycleDroneEvent(): void {
    this.hive.handleRecycleDroneEvent();
  }

  public handleUpgradeHiveEvent(): void {
    this.hive.handleUpgradeHiveEvent();
  }

  public handleEngageDroneEvent(action: WorkerAction): void {
    this.hive.handleEngageDroneEvent(action);
  }

  public handleDisengageDroneEvent(action: WorkerAction): void {
    this.hive.handleDisengageDroneEvent(action);
  }

  public handleEngageWarriorEvent(action: WarriorAction): void {
    this.hive.handleEngageWarriorEvent(action);
  }

  public handleDisengageWarriorEvent(action: WarriorAction): void {
    this.hive.handleDisengageWarriorEvent(action);
  }

  public handleBuildingRequestEvent(resourceId: string): void {
    return this.hive.handleBuildingRequestEvent(resourceId);
  }

  public upgradeHive(): void {
    return this.hive.upgrade();
  }
}
