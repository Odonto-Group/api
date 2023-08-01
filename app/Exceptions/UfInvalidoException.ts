import BaseException from "./BasicLogicalException";

export default class UfInvalidoException extends BaseException {
  constructor() {
    super('O Uf recebido é inválido.', 400, 'UF_INVALIDO_EXCEPTION');
  }
}