import { Expose, Exclude } from 'class-transformer';
import BaseEntityDTO from './base-entity.dto';

@Exclude()
export default class BasePlayerEntityDTO extends BaseEntityDTO {
  @Expose()
  public playerId: string;

  @Expose()
  public maxLife: string;

  @Expose()
  public life: string;
}
