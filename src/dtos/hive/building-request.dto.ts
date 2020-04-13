import { Expose, Exclude } from 'class-transformer';
import BasePlayerEntityDTO from '../shared/base-player-entity.dto';

@Exclude()
export default class BuildingRequestDTO extends BasePlayerEntityDTO {
  @Expose()
  public type: string;

  @Expose()
  public progress: number;
}
