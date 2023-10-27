import { CustomerError } from "./custom-error";

export class DatabaseConnectionError extends CustomerError {
  statusCode = 500;
  reason = 'Error connecting to database';

  constructor() {
    super('Error conecting to db');

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [
      { message: this.reason }
    ];
  }
}