import { Position } from '../../entities';

export default (position: Position, target: Position, precision = 1): boolean => {
  return (
    Math.abs(position.x - target.x) <= precision && Math.abs(position.y - target.y) <= precision
  );
};
