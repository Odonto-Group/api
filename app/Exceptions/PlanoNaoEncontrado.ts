const { LogicalException } = require('@adonisjs/generic-exceptions');

export default class PlanoNaoEncontrado extends LogicalException {
  constructor() {
    super('O plano não foi encontrado', 400);
    //to do retirar a stack
    this.code = 'PLANO_NAO_ENCONTRADO';
  }
}