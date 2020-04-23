import { Socket } from 'socket.io';
import PlayerDTO from '../dtos/player.dto';
import Game from '../game';
import { plainToClass } from 'class-transformer';
import Player from '../entities/player';

export const bindSystemEvents = (socket: Socket, game: Game, player: Player): void => {
  socket.on('ping', () => {
    console.info('ping');
  });

  socket.on('pong', () => {
    console.info('pong');
  });

  socket.on('disconnect', (reason) => {
    if (game && game.state === 'started') {
      console.warn(`Player disconnected: ${reason}, after ${(Date.now() - game.start) / 1000}s`);
      game.removePlayer(player.id);
      socket.broadcast.emit('player.delete', plainToClass(PlayerDTO, player));
      game.stopGameLoop();
    }
  });
};

export const bindPlayerEvents = (socket: Socket, player: Player): void => {
  socket.on('drone.create', () => {
    player.addDrone();
  });
};
