import { Game } from '../entities';
import { Socket } from 'socket.io';
import { Player } from '../entities';
import { plainToClass } from 'class-transformer';
import { PlayerDTO } from '../dtos';

export default (socket: Socket, game: Game, player: Player): void => {
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
