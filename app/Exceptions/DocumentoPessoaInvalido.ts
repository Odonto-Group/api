import BaseException from "./BasicLogicalException";

export default class DocumentoPessoaInvalido extends BaseException {
  constructor() {
    super('Documento do associado inválido', 400, 'DOCUMENTO_ASSOCIADO_INVALIDO');
  }
}