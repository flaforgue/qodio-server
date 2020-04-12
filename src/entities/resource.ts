import BaseEntity from './base-entity';
import Position from './position';

export default class Resource extends BaseEntity {
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

  public provideResourceUnits(amount: number): number {
    let providedResourceUnits = 0;

    if (amount > this._stock) {
      providedResourceUnits = this._stock;
      this._stock = 0;
    } else {
      this._stock -= amount;
      providedResourceUnits = amount;
    }

    return providedResourceUnits;
  }
}
