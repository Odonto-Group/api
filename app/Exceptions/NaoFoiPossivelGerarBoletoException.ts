import BaseException from "./BasicLogicalException";

export default class NaoFoiPossivelGerarBoletoException extends BaseException {
  constructor() {
    super('Não foi possivel gerar o boleto.', 400, 'BOLETO_NAO_GERADO');
  }
}