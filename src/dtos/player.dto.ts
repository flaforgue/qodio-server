import { Expose, Exclude, Type } from 'class-transformer';
import HiveDTO from './hive.dto';
import ResourceDTO from './resource.dto';

@Exclude()
export default class PlayerDTO {
  @Expose()
  @Type(() => HiveDTO)
  public hive: HiveDTO;

  @Expose()
  public id: string;

  @Expose()
  @Type(() => ResourceDTO)
  public knownResources: ResourceDTO[];
}
