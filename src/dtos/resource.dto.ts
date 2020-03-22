import { Expose, Exclude } from 'class-transformer';
import EntityDTO from './entity.dto';

@Exclude()
export default class ResourceDTO extends EntityDTO {
  @Expose()
  public initialStock: number;

  @Expose()
  public stock: number;
}
