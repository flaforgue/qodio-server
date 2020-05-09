import SocketIO from 'socket.io';
import { Player, Board, Position } from './entities';
import { hrtimeMs, removeFromArrayById } from './utils';
import { plainToClass } from 'class-transformer';
import { GameDTO } from './dtos';
import config from './config';

type GameState = 'stopped' | 'started';

export default class Game {
  private _start: number;
  private readonly _board: Board;
  private _namespace: SocketIO.Namespace;
  private _players: Player[] = [];
  private readonly _tickInterval = 1000 / config.fps;
  private _currentTickReference: NodeJS.Timer;
  private _state: GameState = 'stopped';

  public constructor() {
    this._board = new Board(config.boardWidth, config.boardHeight);
  }

  public get isFull(): boolean {
    return this.players.length >= config.nbPlayers;
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

  public get state(): GameState {
    return this._state;
  }

  public emitMessage(socketId: string, name: string, data: unknown): void {
    this._namespace.sockets[socketId].emit(name, data);
  }

  private _update(): void {
    for (let i = 0; i < this._players.length; i++) {
      this._players[i].hive.update();
    }
  }

  private _emitGameTick(): void {
    for (const socketId in this._namespace.sockets) {
      if (Object.prototype.hasOwnProperty.call(this._namespace.sockets, socketId)) {
        this._namespace.sockets[socketId].volatile.emit('game.tick', plainToClass(GameDTO, this));
      }
    }
  }

  private _loop(): void {
    const start = hrtimeMs();
    this._update();
    this._emitGameTick();
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
    if (this._state !== 'stopped') {
      console.info('Game loop stopping');
      clearImmediate(this._currentTickReference);
      clearTimeout(this._currentTickReference);
      this._namespace.emit('game.stop');
      this._state = 'stopped';
      console.info('Game loop stopped');
    }
  }

  public addPlayer(socketId: string): Player {
    // const position = this._board.getRandomPosition();
    const position = new Position(400, 300);
    const player = new Player(this, socketId, position);
    this._players.push(player);
    console.info(`Player ${player.id} joined (${this._players.length}/${config.nbPlayers})`);

    return player;
  }

  public removePlayer(playerId: string): void {
    console.info(`Player ${playerId} left (${this._players.length}/${config.nbPlayers})`);
    removeFromArrayById(this._players, playerId);
  }

  public removeResource(resourceId: string): void {
    this._board.removeResource(resourceId);
  }
}
