import { Position } from '../entities';

export type WarriorAction = 'defend' | 'attack';

export type WorkerAction = 'wait' | 'scout' | 'collect' | 'build' | 'recycle';

export type DroneAction = WorkerAction | WarriorAction;

export type Axis = 'x' | 'y';

export type Direction =
  | 'up'
  | 'upright'
  | 'right'
  | 'downright'
  | 'down'
  | 'downleft'
  | 'left'
  | 'upleft';

export type HiveAction = 'wait' | 'createDrone' | 'createWarrior' | 'recycleDrone' | 'upgradeHive';

export type BuildingType = 'collector';

export type Identifiable = {
  id: string;
};

export interface Attackable {
  readonly life: number;
  readonly maxLife: number;
  readonly position: Position;
  loseLife(amount: number): void;
  die(): void;
}
