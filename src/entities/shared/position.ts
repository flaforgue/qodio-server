export default class Position {
  public x: number;
  public y: number;

  public constructor(x: number, y: number) {
    this.x = Math.floor(x);
    this.y = Math.floor(y);
  }

  public isEqual(position?: Position): boolean {
    return position && this.x === position.x && this.y === position.y;
  }

  public distanceFrom(position: Position): number {
    const xOffset = Math.abs(this.x - position.x);
    const yOffset = Math.abs(this.y - position.y);

    return Math.sqrt(xOffset * xOffset + yOffset * yOffset);
  }
}
