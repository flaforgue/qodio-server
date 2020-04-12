export default class Position {
  public x: number;
  public y: number;

  public constructor(x: number, y: number) {
    this.x = Math.floor(x);
    this.y = Math.floor(y);
  }
}
