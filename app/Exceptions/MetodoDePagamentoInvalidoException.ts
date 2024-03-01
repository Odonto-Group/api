import BaseException from "./BasicLogicalException";

export default class MetodoDePagamentoInvalidoException extends BaseException {
  constructor() {
    super(`O método de pagamento recebido não é válido`, 400, '8');
  }
}