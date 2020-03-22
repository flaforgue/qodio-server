export default class BaseException {
  public readonly message: string;
  public readonly code: string;

  public constructor(code?: string, message?: string) {
    this.message = message;
    this.code = code;
  }
}
