import Hive from './hive/hive';
import Position from './shared/position';
import { v4 as uuidv4 } from 'uuid';
import Game from '../game';

export default class Player {
  public readonly game: Game;
  public readonly hive: Hive;
  public readonly id: string;

  public constructor(game: Game, position: Position) {
    this.id = uuidv4();
    this.game = game;
    this.hive = new Hive(this, position);
  }
}
