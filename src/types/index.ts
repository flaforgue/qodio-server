export type DroneAction = 'wait' | 'scout' | 'collect' | 'build' | 'recycle';

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

export type HiveAction = 'wait' | 'createDrone' | 'recycleDrone' | 'upgradeHive';

export type BuildingType = 'collector';
