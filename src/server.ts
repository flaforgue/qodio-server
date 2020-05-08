import 'reflect-metadata';
import SocketIO, { Socket } from 'socket.io';
import * as http from 'http';
import express from 'express';
import Game from './game';
import { plainToClass } from 'class-transformer';
import { PlayerDTO, GameDTO } from './dtos';
// import GameIsFullException from './exceptions';
import { handleException } from './utils';
import { bindSystemEvents, bindPlayerEvents } from './events';

const port = process.env.PORT ?? 3000;
const app = express();
const server = http.createServer(app);
const io = SocketIO(server);

let game: Game;

io.on('connection', (socket: SocketIO.Socket) => {
  console.info('New connection');

  try {
    if (!game) {
      console.info('New game created');
      game = new Game();
    }

    if (!game.isFull) {
      socket.emit('game.create', plainToClass(GameDTO, game));
      const player = game.addPlayer(socket.id);
      socket.emit('self.create', plainToClass(PlayerDTO, player));

      bindSystemEvents(socket, game, player);
      bindPlayerEvents(socket, player);

      if (game.isFull) {
        game.startGameLoop(io.sockets);
      }
    } else {
      // throw new GameIsFullException();
      // testing only
      game.players.splice(0, game.players.length);
    }
  } catch (e) {
    handleException(e);
  }
});

server.listen(port, () => console.info(`Application is listening on port ${port}`));
