const { LogicalException } = require('@adonisjs/generic-exceptions');

export default class DocumentoPessoaInvalido extends LogicalException {
  constructor() {
    super('Documento do associado inválido', 400);
    this.code = 'DOCUMENTO_ASSOCIADO_INVALIDO';
  }
}