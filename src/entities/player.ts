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

  public detectNewResourcesInRange(position: Position, detectionDistance: number): Resource[] {
    return this._board
      .detectResourcesIfPossible(position, detectionDistance)
      .filter((resource) => !this.doesKnowResource(resource));
  }

  public addKnownResource(resource: Resource): void {
    if (!this.doesKnowResource(resource)) {
      this._knownResources.push(resource);
    }
  }

  public removeKnownResource(resourceId: string): void {
    this._knownResources = this._knownResources.filter((resource) => resource.id != resourceId);
  }

  public doesKnowResource(resource: Resource): boolean {
    return this._knownResources.some((knownResource) => knownResource.id === resource.id);
  }

  public getKnownResource(): Resource | null {
    return this._knownResources.length > 0 ? this._knownResources[0] : null;
  }
}
