import BaseException from "./BasicLogicalException";

export default class ErroInclusaoAssociadoS4EException extends BaseException {
  constructor() {
    super(`Erro ao incluir associado.`, 400, '6');
  }
}