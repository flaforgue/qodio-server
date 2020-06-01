import { WarriorAction } from '../../types';
import { warriorActions } from '../../enums';

export default (action: string): WarriorAction => {
  return (warriorActions.indexOf(action) === -1 ? warriorActions[0] : action) as WarriorAction;
};
