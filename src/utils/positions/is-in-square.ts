import { Position } from '../../entities';

export default (position: Position, width: number, height: number): boolean => {
  return position.x >= 200 && position.y >= 200 && position.x <= width && position.y <= height;
};
