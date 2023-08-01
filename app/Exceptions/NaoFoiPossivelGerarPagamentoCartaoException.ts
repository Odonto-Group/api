import BaseException from "./BasicLogicalException";

export default class NaoFoiPossivelGerarPagamentoCartaoException extends BaseException {
  constructor() {
    super('Não foi possivel gerar o pagamento cartão de crédito.', 400, 'PAGAMENTO_CARTAO_DE_CREDITO_ERRO');
  }
}