import { Expose, Exclude, Type } from 'class-transformer';
import PlayerDTO from './player.dto';
import MapDTO from './map.dto';

@Exclude()
export default class GameDTO {
  @Expose()
  @Type(() => MapDTO)
  public map;

  @Expose()
  @Type(() => PlayerDTO)
  public players: PlayerDTO[];

  @Expose()
  public maxPlayers: number;
}
