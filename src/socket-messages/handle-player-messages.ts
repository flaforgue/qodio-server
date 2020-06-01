import { Socket } from 'socket.io';
import { Player } from '../entities';
import { DroneAction, WorkerAction, WarriorAction } from '../types';
import { getValidWorkerAction, getValidWarriorAction, isWorkerAction } from '../utils';

export default (socket: Socket, player: Player): void => {
  socket.on('drone.create', (action?: DroneAction) => {
    player.handleCreateDroneEvent(getValidWorkerAction(action));
  });

  socket.on('warrior.create', (action?: WarriorAction) => {
    player.handleCreateDroneEvent(getValidWarriorAction(action));
  });

  socket.on('drone.recycle', () => {
    player.handleRecycleDroneEvent();
  });

  socket.on('hive.upgrade', () => {
    player.handleUpgradeHiveEvent();
  });

  socket.on('drone.engage', (action: WorkerAction) => {
    if (isWorkerAction(action)) {
      player.handleEngageDroneEvent(action);
    }
  });

  socket.on('drone.disengage', (action: WorkerAction) => {
    if (isWorkerAction(action)) {
      player.handleDisengageDroneEvent(action);
    }
  });

  socket.on('building.create', (knownResourceId: string) => {
    if (typeof knownResourceId === 'string') {
      player.handleBuildingRequestEvent(knownResourceId);
    }
  });
};
