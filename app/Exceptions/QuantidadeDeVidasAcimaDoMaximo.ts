import BaseException from "./BasicLogicalException";

export default class QuantidadeDeVidasAcimaDoMaximo extends BaseException {
    constructor() {
      super('A quantidade de vidas é maior do que o máximo aceito.', 400, '15');
    }
}