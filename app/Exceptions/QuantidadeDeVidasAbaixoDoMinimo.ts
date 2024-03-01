import BaseException from "./BasicLogicalException";

export default class QuantidadeDeVidasAbaixoDoMinimo extends BaseException {
  constructor() {
    super('A quantidade de vidas é menor do que o mínimo aceito.', 400, '14');
  }
}