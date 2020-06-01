import { workerActions } from '../../enums';

export default (action: string): boolean => {
  return workerActions.indexOf(action) !== -1;
};
