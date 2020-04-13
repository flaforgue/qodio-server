import { Expose, Exclude } from 'class-transformer';

@Exclude()
export default class PositionDTO {
  @Expose()
  public x: number;

  @Expose()
  public y: number;
}
