import Hive from './hive';
import Position from './shared/position';
import { v4 as uuidv4 } from 'uuid';
import Resource from './resource';
import { randomFromArray, removeFromArrayById } from '../utils';
import Game from '../game';

export default class Player {
  private readonly _game: Game;
  private _knownResources: Resource[] = [];
  public readonly hive: Hive;
  public readonly id: string;

  public constructor(game: Game, position: Position) {
    this.id = uuidv4();
    this._game = game;
    this.hive = new Hive(this, position);
  }

  public get knownResources(): Resource[] {
    return this._knownResources;
  }

  public detectNewResourcesInRange(position: Position, detectionDistance: number): Resource[] {
    return this._game.board
      .detectResourcesIfPossible(position, detectionDistance)
      .filter((resource) => !this.doesKnowResource(resource.id));
  }

  public addKnownResource(resource: Resource): void {
    if (!this.doesKnowResource(resource.id)) {
      this._knownResources.push(resource);
    }
  }

  public removeResource(resourceId: string): void {
    this._game.removeResource(resourceId);
  }

  public removeKnownResource(resourceId: string): void {
    removeFromArrayById(this._knownResources, resourceId);
  }

  public doesKnowResource(resourceId: string): boolean {
    return this._knownResources.some((resource) => resource.id === resourceId);
  }

  public getKnownResource(): Resource | null {
    return this._knownResources.length > 0 ? randomFromArray(this._knownResources) : null;
  }
}
