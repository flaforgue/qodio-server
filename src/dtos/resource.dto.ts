import { Expose, Exclude } from 'class-transformer';
import BaseEntityDTO from './base-entity.dto';

@Exclude()
export default class ResourceDTO extends BaseEntityDTO {
  @Expose()
  public initialStock: number;

  @Expose()
  public stock: number;
}
