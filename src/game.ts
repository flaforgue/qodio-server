import Player from './entities/player';
import Board from './entities/board';
import Position from './entities/position';
import { hrtimeMs } from './utils';

type GameState = 'stopped' | 'started';

const fps = 120;

export default class Game {
  private _board: Board;
  private _players: Player[] = [];
  private _maxPlayers = 1;

  private _tickInterval = 1000 / fps;
  private _currentTickReference: NodeJS.Timer;
  private _stopCallback: () => void;
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

  private _update(): void {
    this.players.forEach((player) => {
      player.hive.drones.forEach((drone) => {
        drone.update();
      });
    });
  }

  private _loop(callback: () => void): void {
    const start = hrtimeMs();
    this._update();
    callback();
    const frameTime = hrtimeMs() - start;

    if (frameTime < this._tickInterval) {
      this._currentTickReference = setTimeout(
        () => this._loop(callback),
        this._tickInterval - frameTime,
      );
    } else {
      setImmediate(() => this._loop(callback));
    }
  }

  public startGameLoop(syncCallback: () => void, stopCallback: () => void): void {
    if (this._state === 'stopped') {
      console.info('Game loop started');
      this._stopCallback = stopCallback;
      this._state = 'started';
      this._loop(syncCallback);
    }
  }

  public stopGameLoop(): void {
    if (this._state === 'started') {
      console.info('Game loop stopped');
      clearTimeout(this._currentTickReference);
      this._state = 'stopped';
      this._stopCallback();
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

  public isFull(): boolean {
    return this.players.length >= this._maxPlayers;
  }

  public removePlayer(playerId: string): void {
    for (let i = 0; i < this._players.length; i++) {
      if (this._players[i].id != playerId) {
        this._players.splice(i, 1);
        return;
      }
    }

    console.info(`Player ${playerId} left (${this._players.length}/${this._maxPlayers})`);

    this.stopGameLoop();
  }
}
