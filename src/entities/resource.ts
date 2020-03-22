import Entity from './entity';
import Position from './position';

export default class Resource extends Entity {
  private _stock: number;
  public readonly initialStock: number;

  public constructor(position: Position, initialStock: number) {
    super(position);

    this.initialStock = initialStock;
    this._stock = initialStock;
  }

  public get stock(): number {
    return this._stock;
  }
}
