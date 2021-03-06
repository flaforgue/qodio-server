import SocketIO from 'socket.io';
import { Player, Map, Position } from '.';
import { hrtimeMs, removeFromArrayById } from '../utils';
import { plainToClass } from 'class-transformer';
import { GameDTO } from '../dtos';
import config from '../config';

type GameState = 'stopped' | 'started';

export default class Game {
  private _start: number;
  private readonly _map: Map;
  private _namespace: SocketIO.Namespace;
  private _players: Player[] = [];
  private readonly _tickInterval = 1000 / config.fps;
  private _currentTickReference: NodeJS.Timer;
  private _state: GameState = 'stopped';

  public constructor() {
    this._map = new Map(config.mapWidth, config.mapHeight);
  }

  public get isFull(): boolean {
    return this.players.length >= config.nbPlayers;
  }

  public get map(): Map {
    return this._map;
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
    if (this._state === 'started') {
      this._namespace.sockets[socketId].emit(name, data);
    }
  }

  private _update(): void {
    for (let i = 0; i < this._players.length; i++) {
      this._players[i].hive.update();
    }
  }

  private _emitGameTick(): void {
    if (this._state === 'started') {
      for (const socketId in this._namespace.sockets) {
        if (Object.prototype.hasOwnProperty.call(this._namespace.sockets, socketId)) {
          this._namespace.sockets[socketId].volatile.emit('game.tick', plainToClass(GameDTO, this));
        }
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
    if (this._players.length < config.nbPlayers) {
      const position = this._getNewPlayerPosition();
      const player = new Player(this, socketId, position);

      if (this._players.length) {
        this.players[0].ennemyHive = player.hive;
        player.ennemyHive = this.players[0].hive;
      }

      this._players.push(player);
      console.info(`Player ${player.id} joined (${this._players.length}/${config.nbPlayers})`);

      return player;
    }
  }

  public removePlayer(playerId: string): void {
    console.info(`Player ${playerId} left (${this._players.length}/${config.nbPlayers})`);
    removeFromArrayById(this._players, playerId);
  }

  private _getNewPlayerPosition(): Position {
    return this._players.length
      ? new Position(config.mapWidth - 400, config.mapHeight - 300)
      : new Position(400, 300);
  }

  public removeResource(resourceId: string): void {
    this._map.removeResource(resourceId);
  }
}
