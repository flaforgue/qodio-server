import BaseException from './base.exception';

export default class GameIsFullException extends BaseException {
  public readonly message = 'The game is full';
}
