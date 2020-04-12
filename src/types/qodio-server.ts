export type DroneAction = 'wait' | 'scout' | 'gather';

export type Axis = 'x' | 'y';

export type DroneActionHandler = () => boolean;

export type Direction =
  | 'up'
  | 'upright'
  | 'right'
  | 'downright'
  | 'down'
  | 'downleft'
  | 'left'
  | 'upleft';
