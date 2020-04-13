import { Expose, Exclude, Type } from 'class-transformer';
import PositionDTO from './position.dto';

@Exclude()
export default class BaseEntityDTO {
  @Expose()
  @Type(() => PositionDTO)
  public position: PositionDTO;

  @Expose()
  public id: string;
}
