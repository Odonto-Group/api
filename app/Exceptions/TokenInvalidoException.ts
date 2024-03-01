import BaseException from "./BasicLogicalException";

export default class TokenInvalidoException extends BaseException {
  constructor() {
    super('O token recebido é inválido.', 400, '17');
  }
}