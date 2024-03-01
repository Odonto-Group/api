import BaseException from "./BasicLogicalException";

export default class VendedorNaoEncontradoException extends BaseException {
  constructor() {
    super('O vendedor nao foi encontrado.', 400, '19');
  }
}