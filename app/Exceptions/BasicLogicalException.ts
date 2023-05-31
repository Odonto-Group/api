import { LogicalException } from "@adonisjs/generic-exceptions";

export default class BaseException extends LogicalException {
    constructor(message: string, status: number, code: string) {
      super(message, status);
      this.code = code;
    }
  
    handle(error, { response }) {
      response
        .status(this.status)
        .send({
          error: this.message,
          code: this.code
        })
    }
  }