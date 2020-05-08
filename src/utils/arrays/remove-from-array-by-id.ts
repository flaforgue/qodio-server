import { IdEntity } from '../../entities';

export default <T extends IdEntity>(arr: T[], id: string): T | undefined => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return arr.splice(i, 1)[0];
    }
  }
};
