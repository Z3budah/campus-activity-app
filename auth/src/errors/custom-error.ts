export abstract class CustomerError extends Error {
  abstract statusCode: number;

  constructor(msg: string) {
    super();

    Object.setPrototypeOf(this, CustomerError.prototype);
  }

  abstract serializeErrors(): { message: string, field?: string }[]
}
