import SocketIO from 'socket.io';
import Player from './entities/player';
import Board from './entities/board';
import Position from './entities/position';
import { hrtimeMs } from './utils';
import { plainToClass } from 'class-transformer';
import GameDTO from './dtos/game.dto';

type GameState = 'stopped' | 'started';

const fps = 120;

export default class Game {
  private _start: number;
  private _socket: SocketIO.Socket;
  private _board: Board;
  private _players: Player[] = [];
  private _maxPlayers = 1;

  private _tickInterval = 1000 / fps;
  private _currentTickReference: NodeJS.Timer;
  private _state: GameState = 'stopped';
  public nbTick = 0;

  public constructor() {
    this._board = new Board();
  }

  public get board(): Board {
    return this._board;
  }

  public get players(): Player[] {
    return this._players;
  }

  public get start(): number {
    return this._start;
  }

  private _update(): void {
    this.players.forEach((player) => {
      player.hive.drones.forEach((drone) => {
        drone.update();
      });
    });
  }

  private _loop(): void {
    console.log((Date.now() - this._start) / 1000);
    const start = hrtimeMs();
    this.nbTick++;
    console.log(this.nbTick);
    this._update();
    this._socket.volatile.emit('game.tick', plainToClass(GameDTO, this));
    const frameTime = hrtimeMs() - start;

    if (frameTime < this._tickInterval) {
      this._currentTickReference = setTimeout(() => this._loop(), this._tickInterval - frameTime);
    } else {
      this._currentTickReference = setImmediate(() => this._loop());
    }
  }

  public startGameLoop(socket: SocketIO.Socket): void {
    if (this._state === 'stopped') {
      console.info('Game loop started');
      this._socket = socket;
      this._state = 'started';
      this._start = Date.now();
      this._loop();
    }
  }

  public stopGameLoop(): void {
    if (this._state === 'started') {
      console.info('Game loop stopping');
      clearImmediate(this._currentTickReference);
      clearTimeout(this._currentTickReference);
      this._socket.emit('game.stop');
      this._state = 'stopped';
      console.info('Game loop stopped');
    } else {
      throw new Error('not started');
    }
  }

  public addPlayer(): Player {
    // const position = this._board.getRandomPosition();
    const position = new Position(this._board.width / 2, this._board.height / 2);
    const player = new Player(this._board, position);
    this._players.push(player);

    console.info(`Player ${player.id} joined (${this._players.length}/${this._maxPlayers})`);

    return player;
  }

  public get isFull(): boolean {
    return this.players.length >= this._maxPlayers;
  }

  public removePlayer(playerId: string): void {
    for (let i = 0; i < this._players.length; i++) {
      if (this._players[i].id === playerId) {
        this._players.splice(i, 1);
        console.info(`Player ${playerId} left (${this._players.length}/${this._maxPlayers})`);
        return;
      }
    }
  }
}
