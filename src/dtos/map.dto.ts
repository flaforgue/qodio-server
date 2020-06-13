import { Expose, Exclude, Type } from 'class-transformer';
import ResourceDTO from './resource.dto';

@Exclude()
export default class MapDTO {
  @Expose()
  public width: number;

  @Expose()
  public height: number;

  @Expose()
  @Type(() => ResourceDTO)
  public resources: ResourceDTO[];
}
