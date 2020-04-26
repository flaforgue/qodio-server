import { Position } from '../../entities';
import config from '../../config';
import isInSquare from './is-in-square';

export default (position: Position): boolean => {
  return isInSquare(position, config.boardWidth, config.boardHeight);
};
