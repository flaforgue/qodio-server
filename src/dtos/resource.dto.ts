import { Expose, Exclude } from 'class-transformer';
import BaseEntityDTO from './shared/base-entity.dto';

@Exclude()
export default class ResourceDTO extends BaseEntityDTO {
  @Expose()
  public initialStock: number;

  @Expose()
  public stock: number;
}
