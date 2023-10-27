import { CustomerError } from "./custom-error";

export class NotFoundError extends CustomerError {
  statusCode = 404;

  constructor() {
    super('Router not found');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [
      { message: 'Not Found' }
    ];
  }
}