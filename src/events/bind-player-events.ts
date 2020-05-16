import { Socket } from 'socket.io';
import { Player } from '../entities';
import { DroneAction } from '../types';
import { droneActions } from '../enums';

const getValidDroneAction = (action: string): DroneAction => {
  return droneActions.indexOf(action) === -1 ? 'wait' : (action as DroneAction);
};

export default (socket: Socket, player: Player): void => {
  socket.on('drone.create', (action?: DroneAction) => {
    player.handleCreateDroneEvent(getValidDroneAction(action));
  });

  socket.on('drone.recycle', () => {
    player.handleRecycleDroneEvent();
  });

  socket.on('hive.upgrade', () => {
    player.handleUpgradeHiveEvent();
  });

  socket.on('drone.engage', (action: DroneAction) => {
    player.handleEngageDroneEvent(getValidDroneAction(action));
  });

  socket.on('drone.disengage', (action: DroneAction) => {
    player.handleDisengageDroneEvent(getValidDroneAction(action));
  });

  socket.on('building.create', (knownResourceId: string) => {
    if (typeof knownResourceId === 'string') {
      player.handleBuildingRequestEvent(knownResourceId);
    }
  });
};
