import { Expose, Exclude, Type } from 'class-transformer';
import PlayerDTO from './player.dto';
import BoardDTO from './board.dto';

@Exclude()
export default class GameDTO {
  @Expose()
  @Type(() => BoardDTO)
  public board;

  @Expose()
  @Type(() => PlayerDTO)
  public players: PlayerDTO[];

  @Expose()
  public maxPlayers: number;
}
