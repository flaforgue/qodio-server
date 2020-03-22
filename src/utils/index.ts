import Position from '../entities/position';
import BaseException from '../exceptions/base.exception';

const hrtimeMs = (): number => {
  const time = process.hrtime();
  return time[0] * 1000 + time[1] / 1000000;
};

const handleException = (exception: unknown): void => {
  if (exception instanceof BaseException) {
    console.warn(exception.message);
  } else {
    console.error(exception);
  }
};

const isNear = (position: Position, target: Position, successTrheshold = 0): boolean => {
  return (
    Math.abs(position.x - target.x) <= successTrheshold &&
    Math.abs(position.y - target.y) <= successTrheshold
  );
};

const findTargetInCircle = (center: Position, radius: number): Position => {
  const r = Math.random() * radius;
  const theta = Math.random() * 2 * Math.PI;

  return new Position(center.x + r * Math.cos(theta), center.y + r * Math.sin(theta));
};

export { hrtimeMs, handleException, isNear, findTargetInCircle };
