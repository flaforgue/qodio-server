import { Socket } from 'socket.io';
import { Player } from '../entities';
import { DroneAction } from '../types';
import HiveDTO from '../dtos/hive/hive.dto';
import { plainToClass } from 'class-transformer';

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
    player.engageDrone(action);
    socket.emit('drone.engaged', action);
  });

  socket.on('drone.disengage', (action: DroneAction) => {
    player.disengageDrone(action);
    socket.emit('drone.disengaged', action);
  });

  socket.on('building.create', (knownResourceId: string) => {
    if (player.addBuildingRequest(knownResourceId)) {
      socket.emit('building.created', knownResourceId);
    }
  });

  socket.on('hive.upgrade', () => {
    if (player.upgradeHive()) {
      socket.emit('hive.upgraded', plainToClass(HiveDTO, player.hive));
    }
  });
};
