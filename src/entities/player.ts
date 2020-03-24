import Hive from './hive';
import Position from './position';
import { v4 as uuidv4 } from 'uuid';
import Board from './board';
import Resource from './resource';
import { randomFromArray } from '../utils';

export default class Player {
  private readonly _board: Board;
  private _knownResources: Resource[] = [];
  public readonly hive: Hive;
  public readonly id: string;

  public constructor(board: Board, position: Position) {
    this.id = uuidv4();
    this._board = board;
    this.hive = new Hive(this, position);
  }

  public get knownResources(): Resource[] {
    return this._knownResources;
  }

  public detectNewResourcesInRange(position: Position, detectionDistance: number): Resource[] {
    return this._board
      .detectResourcesIfPossible(position, detectionDistance)
      .filter((resource) => !this.doesKnowResource(resource.id));
  }

  public addKnownResource(resource: Resource): void {
    if (!this.doesKnowResource(resource.id)) {
      this._knownResources.push(resource);
    }
  }

  public removeKnownResource(resourceId: string): void {
    for (let i = 0; i < this._knownResources.length; i++) {
      if (this._knownResources[i].id === resourceId) {
        this._knownResources.splice(i, 1);
        return;
      }
    }
  }

  public doesKnowResource(resourceId: string): boolean {
    return this._knownResources.some((knownResource) => knownResource.id === resourceId);
  }

  public getKnownResource(): Resource | null {
    return this._knownResources.length > 0 ? randomFromArray(this._knownResources) : null;
  }
}
