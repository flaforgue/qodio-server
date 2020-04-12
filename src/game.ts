import SocketIO from 'socket.io';
import Player from './entities/player';
import Board from './entities/board';
import { hrtimeMs } from './utils';
import { plainToClass } from 'class-transformer';
import GameDTO from './dtos/game.dto';
import config from './config';

type GameState = 'stopped' | 'started';

export default class Game {
  private _start: number;

  private readonly _maxPlayers = 1;
  private readonly _board: Board;
  private _namespace: SocketIO.Namespace;
  private _players: Player[] = [];
  private readonly _tickInterval = 1000 / config.fps;
  private _currentTickReference: NodeJS.Timer;
  private _state: GameState = 'stopped';

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

  private _emit(): void {
    for (const socketId in this._namespace.sockets) {
      if (Object.prototype.hasOwnProperty.call(this._namespace.sockets, socketId)) {
        this._namespace.sockets[socketId].volatile.emit('game.tick', plainToClass(GameDTO, this));
      }
    }
  }

  private _loop(): void {
    const start = hrtimeMs();
    this._update();
    this._emit();
    const frameTime = hrtimeMs() - start;

    if (frameTime < this._tickInterval) {
      this._currentTickReference = setTimeout(() => this._loop(), this._tickInterval - frameTime);
    } else {
      this._currentTickReference = setImmediate(() => this._loop());
    }
  }

  public startGameLoop(namespace: SocketIO.Namespace): void {
    if (this._state === 'stopped') {
      console.info('Game loop started');
      this._namespace = namespace;
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
      this._namespace.emit('game.stop');
      this._state = 'stopped';
      console.info('Game loop stopped');
    } else {
      throw new Error('not started');
    }
  }

  public addPlayer(): Player {
    const position = this._board.getRandomPosition();
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
