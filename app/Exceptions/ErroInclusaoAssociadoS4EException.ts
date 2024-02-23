import BaseException from "./BasicLogicalException";

export default class ErroInclusaoAssociadoS4EException extends BaseException {
  constructor() {
    super(`Erro ao incluiar associado.`, 400, 'ERRO_AO_INCLUIR_ASSOCIADO');
  }
}