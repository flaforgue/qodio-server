import BaseEntity from '../shared/base-entity';
import { BuildingType } from '../../types';
import Resource from '../resource';

export default class BuildingRequest extends BaseEntity {
  private readonly _type: BuildingType;
  private _progress = 0;
  public readonly resource: Resource;

  public constructor(resource: Resource) {
    super(resource.position);
    this._type = 'collector';
    this.resource = resource;
  }

  public get progress(): number {
    return this._progress;
  }

  public get type(): BuildingType {
    return this._type;
  }

  public addProgress(progress: number): void {
    this._progress += progress;

    if (this._progress > 100) {
      this._progress = 100;
    }
  }
}
