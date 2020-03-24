import Position from '../entities/position';
import BaseException from '../exceptions/base.exception';

const handleException = (exception: unknown): void => {
  if (exception instanceof BaseException) {
    console.warn(exception.message);
  } else {
    console.error(exception);
  }
};

const isNear = (position: Position, target: Position, precision = 1): boolean => {
  return (
    Math.abs(position.x - target.x) <= precision && Math.abs(position.y - target.y) <= precision
  );
};

const findTargetInCircle = (center: Position, radius: number): Position => {
  const r = Math.random() * radius;
  const theta = Math.random() * 2 * Math.PI;

  return new Position(center.x + r * Math.cos(theta), center.y + r * Math.sin(theta));
};

const randomFromArray = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export { handleException, isNear, findTargetInCircle, randomFromArray };
