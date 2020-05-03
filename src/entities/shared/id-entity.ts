import { v4 as uuidv4 } from 'uuid';

export default class IdEntity {
  public readonly id: string;

  public constructor() {
    this.id = uuidv4();
  }
}
