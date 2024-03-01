import BaseException from "./BasicLogicalException";

export default class NaoFoiPossivelCriarPagamento extends BaseException {
  constructor() {
    super('Não foi possivel criar pagamento.', 400, '9');
  }
}