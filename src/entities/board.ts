import Resource from './resource';
import Position from './shared/position';
import { isNear, removeFromArrayById } from '../utils';
import config from '../config';

export default class Board {
  public readonly width: number;
  public readonly height: number;
  public readonly resources: Resource[] = [];

  public constructor(width, height) {
    this.width = width;
    this.height = height;
    this._generateResources(Math.floor(this.width * this.height * config.resourceConcentration));
  }

  private _generateResources(nbToGenerate: number): void {
    for (let i = 0; i < nbToGenerate; i++) {
      this.createResource(this.getRandomPosition());
    }

    // console.info('Ignoring', nbToGenerate);
    // this.createResource(new Position(100, 100));
    // this.createResource(new Position(100, 400));
    // this.createResource(new Position(100, 700));
    // this.createResource(new Position(400, 100));
    // this.createResource(new Position(700, 100));
    // this.createResource(new Position(400, 700));
    // this.createResource(new Position(700, 400));
    // this.createResource(new Position(700, 700));
  }

  public createResource(position: Position, initialStock?: number): void {
    const initialResource = initialStock ?? Math.floor(Math.random() * 250) + 250;
    this.resources.push(new Resource(position, initialResource));
  }

  public getRandomPosition(): Position {
    return new Position(Math.random() * this.width, Math.random() * this.height);
  }

  public detectResourcesIfPossible(position: Position, detectionDistance: number): Resource[] {
    return this.resources.filter((resource) =>
      isNear(position, resource.position, detectionDistance),
    );
  }

  public removeResource(resourceId: string): void {
    removeFromArrayById(this.resources, resourceId);
  }
}
