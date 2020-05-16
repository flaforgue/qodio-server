export default abstract class BaseActionHandler<T> {
  public readonly _entity: T;

  public constructor(entity: T) {
    this._entity = entity;
  }

  public abstract handle(): boolean;
  public reset(): void {}
}
