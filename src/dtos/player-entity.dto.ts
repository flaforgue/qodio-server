import { Expose, Exclude } from 'class-transformer';
import EntityDTO from './entity.dto';

@Exclude()
export default class PlayerEntityDTO extends EntityDTO {
  @Expose()
  public playerId: string;
}
