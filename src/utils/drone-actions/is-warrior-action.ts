import { warriorActions } from '../../enums';

export default (action: string): boolean => {
  return warriorActions.indexOf(action) !== -1;
};
