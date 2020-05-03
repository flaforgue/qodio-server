import { Position } from '../../entities';

export default (position: Position, width: number, height: number): boolean => {
  return position.x >= 0 && position.y >= 0 && position.x <= width && position.y <= height;
};
