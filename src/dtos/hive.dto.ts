import { Expose, Exclude, Type } from 'class-transformer';
import BasePlayerEntityDTO from './base-player-entity.dto';
import DroneDTO from './drone.dto';

@Exclude()
export default class HiveDTO extends BasePlayerEntityDTO {
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
  @Type(() => DroneDTO)
  public drones: DroneDTO;
}
