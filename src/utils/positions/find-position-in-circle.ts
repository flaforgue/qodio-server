import { Position } from '../../entities';

export default (center: Position, radius: number, shouldBeOnPerimeter = false): Position => {
  const r = shouldBeOnPerimeter ? radius : Math.random() * radius;
  const theta = Math.random() * 2 * Math.PI;

  return new Position(center.x + r * Math.cos(theta), center.y + r * Math.sin(theta));
};
