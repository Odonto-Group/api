import BaseException from "./BasicLogicalException";

export default class FormaPagamentoNaoEncontrada extends BaseException {
  constructor() {
    super('Não foi encontrada uma forma de pagamento', 400, 'FORMA_PAGAMENTO_NAO_ENCONTRADA');
  }
}