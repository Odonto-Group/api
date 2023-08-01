import BaseException from "./BasicLogicalException";

export default class OrgaoExpedidorInvalido extends BaseException {
  constructor() {
    super(`Orgão Expedidor é inválido`, 400, 'ORGAO_EXPEDIDOR_INVÁLIDO');
  }
}