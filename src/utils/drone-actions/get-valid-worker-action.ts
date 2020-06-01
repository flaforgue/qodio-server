import { workerActions } from '../../enums';
import { WorkerAction } from '../../types';

export default (action: string): WorkerAction => {
  return (workerActions.indexOf(action) === -1 ? workerActions[0] : action) as WorkerAction;
};
