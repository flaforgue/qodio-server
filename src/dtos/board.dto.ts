import { Expose, Exclude, Type } from 'class-transformer';
import ResourceDTO from './resource.dto';

@Exclude()
export default class BoardDTO {
  @Expose()
  public width: number;

  @Expose()
  public height: number;

  // todo: remove from DTO
  @Expose()
  @Type(() => ResourceDTO)
  public resources: ResourceDTO[];
}
