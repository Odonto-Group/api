import BaseException from "./BasicLogicalException";

export default class SituacaoPagamentoCartaoDesconhecidaException extends BaseException {
    constructor() {
      super('A situação de pagamento inválida.', 400, '16');
    }
}