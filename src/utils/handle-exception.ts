import { BaseException } from '../exceptions';

export default (exception: unknown): void => {
  if (exception instanceof BaseException) {
    console.warn(exception.message);
  } else {
    throw exception;
  }
};
