import { Expose, Exclude } from 'class-transformer';
import PlayerEntityDTO from './player-entity.dto';

@Exclude()
export default class DroneDTO extends PlayerEntityDTO {
  @Expose()
  public action: string;

  @Expose()
  public carriedResourceUnits: number;
}
