import { Expose, Exclude, Type } from 'class-transformer';
import HiveDTO from './hive/hive.dto';

@Exclude()
export default class PlayerDTO {
  @Expose()
  @Type(() => HiveDTO)
  public hive: HiveDTO;

  @Expose()
  public id: string;
}
