import BaseException from "./BasicLogicalException";

export default class DataExpiracaoInvalida extends BaseException {
  constructor() {
    super('Data de expiracão é inválida', 400, 'DATA_EXPIRACAO_INVALIDA');
  }
}