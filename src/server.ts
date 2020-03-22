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

const game = new Game();

io.on('connection', (socket: SocketIO.Socket) => {
  console.info('New connection');

  try {
    if (!game.isFull()) {
      socket.emit('game.create', plainToClass(GameDTO, game));

      const player = game.addPlayer();
      socket.emit('self.create', plainToClass(PlayerDTO, player));

      socket.on('disconnect', () => {
        game.removePlayer(player);
        socket.broadcast.emit('player.delete', plainToClass(PlayerDTO, player));
      });

      if (game.isFull()) {
        game.startGameLoop(
          () => {
            io.sockets.emit('game.tick', plainToClass(GameDTO, game));
          },
          () => {
            io.sockets.emit('game.stop');
          },
        );
      }
    } else {
      throw new GameIsFullException();
    }
  } catch (e) {
    handleException(e);
  }
});

server.listen(port, () => console.info(`Application is listening on port ${port}`));
