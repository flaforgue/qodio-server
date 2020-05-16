import { Expose, Exclude, Type } from 'class-transformer';
import BasePlayerEntityDTO from '../shared/base-player-entity.dto';
import DroneDTO from '../drone/drone.dto';
import BuildingRequestDTO from './building-request.dto';
import ResourceDTO from '../resource.dto';
import { DroneAction, HiveAction } from '../../types';

@Exclude()
export default class HiveDTO extends BasePlayerEntityDTO {
  @Expose()
  public level: number;

  @Expose()
  public action: HiveAction;

  @Expose()
  public actionProgress: number;

  @Expose()
  public radius: number;

  @Expose()
  public territoryRadius: number;

  @Expose()
  public stock: number;

  @Expose()
  public maxStock: number;

  @Expose()
  public maxPopulation: number;

  @Expose()
  public nbResourcesDiscovered: number;

  @Expose()
  @Type(() => DroneDTO)
  public drones: DroneDTO;

  @Expose()
  public actionsNbDrones: Record<DroneAction, number>;

  @Expose()
  @Type(() => ResourceDTO)
  public knownResources: ResourceDTO[];

  @Expose()
  @Type(() => BuildingRequestDTO)
  public buildingRequests: BuildingRequestDTO;

  @Expose()
  @Type(() => ResourceDTO)
  public collectors: ResourceDTO[];
}
