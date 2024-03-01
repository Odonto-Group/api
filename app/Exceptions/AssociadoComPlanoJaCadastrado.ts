import BaseException from "./BasicLogicalException";

export default class AssociadoComPlanoJaCadastrado extends BaseException {
  constructor() {
    super('Associado já possui cadastro! Por favor, entre em contato com a nossa central 4007-1087', 400, '1');
  }
}