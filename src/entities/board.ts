import Resource from './resource';
import Position from './position';
import { isNear } from '../utils';

const resourceConcentration = 0.0005; // resource per pixels square

export default class Board {
  public readonly width: number;
  public readonly height: number;
  public readonly resources: Resource[] = [];

  public constructor(width = 1200, height = 600) {
    this.width = width;
    this.height = height;
    this._generateResources(Math.floor(this.width * this.height * resourceConcentration));
  }

  private _generateResources(nbToGenerate: number): void {
    for (let i = 0; i < nbToGenerate; i++) {
      const initialResource = Math.floor(Math.random() * 70) + 30;
      this.resources.push(new Resource(this.getRandomPosition(), initialResource));
    }
  }

  public getRandomPosition(): Position {
    return new Position(Math.random() * this.width, Math.random() * this.height);
  }

  public detectResourcesIfPossible(position: Position, detectionDistance: number): Resource[] {
    return this.resources.filter((resource) =>
      isNear(position, resource.position, detectionDistance),
    );
  }

  public deleteKnownResource(resourceId: string): void {
    for (let i = 0; i < this.resources.length; i++) {
      if (this.resources[i].id === resourceId) {
        this.resources.splice(i, 1)[0];
        return;
      }
    }
  }
}
