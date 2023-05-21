const { LogicalException } = require('@adonisjs/generic-exceptions');

export default class TokenVazioException extends LogicalException {
  constructor() {
    super('O token recebido está vazio.', 400);
    this.code = 'TOKEN_VAZIO_EXCEPTION';
  }
}