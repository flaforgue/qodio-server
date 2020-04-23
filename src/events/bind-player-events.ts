import { Socket } from 'socket.io';
import { Player } from '../entities';
import { DroneAction } from '../types';

export default (socket: Socket, player: Player): void => {
  socket.on('drone.create', () => {
    player.addDrone();
    socket.emit('drone.created');
  });

  socket.on('drone.recycle', () => {
    player.recycleDrone();
    socket.emit('drone.recycled');
  });

  socket.on('drone.engage', (action: DroneAction) => {
    console.log('drone.engage', action);
    player.engageDrone(action);
  });

  socket.on('drone.disengage', (action: DroneAction) => {
    console.log('drone.disengage', action);
    player.disengageDrone(action);
  });
};
