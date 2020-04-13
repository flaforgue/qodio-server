import { Expose, Exclude } from 'class-transformer';
import BasePlayerEntityDTO from '../shared/base-player-entity.dto';

@Exclude()
export default class DroneDTO extends BasePlayerEntityDTO {
  @Expose()
  public action: string;

  @Expose()
  public direction: string;

  @Expose()
  public carriedResourceUnits: number;
}
