import Hive from './hive/hive';
import Position from './shared/position';
import { v4 as uuidv4 } from 'uuid';
import Game from '../game';
import { DroneAction } from '../types';

export default class Player {
  public readonly game: Game;
  public readonly hive: Hive;
  public readonly id: string;
  private readonly socketId: string;

  public constructor(game: Game, socketId: string, position: Position) {
    this.id = uuidv4();
    this.game = game;
    this.socketId = socketId;
    this.hive = new Hive(this, position);
  }

  public emitMessage(name: string, data: unknown): void {
    this.game.emitMessage(this.socketId, name, data);
  }

  public addDrone(): void {
    this.hive.addDrone();
  }

  public recycleDrone(): void {
    this.hive.recycleDrone();
  }

  public engageDrone(action: DroneAction): void {
    this.hive.engageDrone(action);
  }

  public disengageDrone(action: DroneAction): void {
    this.hive.disengageDrone(action);
  }

  public addBuildingRequest(resourceId: string): boolean {
    return this.hive.addBuildingRequest(resourceId);
  }
}
