import { Expose, Exclude, Type } from 'class-transformer';
import PlayerEntityDTO from './player-entity.dto';
import DroneDTO from './drone.dto';

@Exclude()
export default class HiveDTO extends PlayerEntityDTO {
  @Expose()
  public radius: number;

  @Expose()
  public territoryRadius: number;

  @Expose()
  @Type(() => DroneDTO)
  public drones: DroneDTO;
}
