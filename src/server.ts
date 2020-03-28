import 'reflect-metadata';
import SocketIO from 'socket.io';
import * as http from 'http';
import express from 'express';
import Game from './game';
import { plainToClass } from 'class-transformer';
import PlayerDTO from './dtos/player.dto';
import GameDTO from './dtos/game.dto';
import GameIsFullException from './exceptions/game-is-full.exception';
import { handleException } from './utils';

const port = process.env.PORT ?? 3000;
const app = express();
const server = http.createServer(app);
const io = SocketIO(server);

let game;

io.on('connection', (socket: SocketIO.Socket) => {
  console.info('New connection');

  try {
    if (!game) {
      console.info('New game created');
      game = new Game();
    }

    if (!game.isFull) {
      socket.emit('game.create', plainToClass(GameDTO, game));

      const player = game.addPlayer();
      socket.emit('self.create', plainToClass(PlayerDTO, player));

      socket.on('disconnect', (reason) => {
        console.warn(`Player disconnected: ${reason}, after ${(Date.now() - game.start) / 1000}s`);
        game.removePlayer(player.id);
        socket.broadcast.emit('player.delete', plainToClass(PlayerDTO, player));
        game.stopGameLoop();
        game = null;
      });

      socket.on('ping', () => {
        console.log('ping');
      });

      socket.on('pong', () => {
        console.log('pong');
      });

      if (game.isFull) {
        game.startGameLoop(socket);
      }
    } else {
      throw new GameIsFullException();
    }
  } catch (e) {
    handleException(e);
  }
});

server.listen(port, () => console.info(`Application is listening on port ${port}`));
