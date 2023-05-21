const { LogicalException } = require('@adonisjs/generic-exceptions');

export default class FormaPagamentoNaoEncontrada extends LogicalException {
  constructor() {
    super('Não foi encontrada uma forma de pagamento não encontrada', 400);
    this.code = 'FORMA_PAGAMENTO_NAO_ENCONTRADA';
  }
}