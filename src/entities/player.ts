import Hive from './hive';
import Position from './position';
import { v1 as uuidv1 } from 'uuid';
import Board from './board';
import Resource from './resource';

export default class Player {
  private readonly _board: Board;
  private _knownResources: Resource[] = [];
  public readonly hive: Hive;
  public readonly id: string;

  public constructor(board: Board, position: Position) {
    this.id = uuidv1();
    this._board = board;
    this.hive = new Hive(this, position);
  }

  public get knownResources(): Resource[] {
    return this._knownResources;
  }

  public findResourcesIfPossible(position: Position, detectionDistance: number): Resource[] {
    return this._board.findResourcesIfPossible(position, detectionDistance);
  }

  public addKnownResources(resources: Resource[]): void {
    this._knownResources.push(...resources);
  }
}
