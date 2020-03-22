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

  public _findNewResourcesInRange(position: Position, detectionDistance: number): Resource[] {
    return this._board
      .findResourcesIfPossible(position, detectionDistance)
      .filter((resource) => !this._doesKnowResource(resource));
  }

  public addKnownResource(resource: Resource): void {
    if (!this._doesKnowResource(resource)) {
      this._knownResources.push(resource);
    }
  }

  private _doesKnowResource(resource: Resource): boolean {
    return this._knownResources.some((knownResource) => knownResource.id === resource.id);
  }
}
