import Hive from './hive/hive';
import Position from './shared/position';
import { v4 as uuidv4 } from 'uuid';
import Game from '../game';
import { DroneAction } from '../types';

export default class Player {
  public readonly game: Game;
  public readonly hive: Hive;
  public readonly id: string;

  public constructor(game: Game, position: Position) {
    this.id = uuidv4();
    this.game = game;
    this.hive = new Hive(this, position);
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

  public addBuildingRequest(resourceId: string): void {
    this.hive.addBuildingRequest(resourceId);
  }
}
