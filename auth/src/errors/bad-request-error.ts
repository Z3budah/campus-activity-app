import { CustomerError } from "./custom-error";

export class BadRequestError extends CustomerError {
  statusCode = 400;

  constructor(public msg: string) {
    super(msg);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [
      { message: this.msg }
    ];
  }
}