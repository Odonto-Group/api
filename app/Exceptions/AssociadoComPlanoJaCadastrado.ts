import BaseException from "./BasicLogicalException";

export default class AssociadoComPlanoJaCadastrado extends BaseException {
  constructor() {
    super('Associado já possui cadastro! Por favor, entre em contato com a nossa central 40071087', 400, 'ASSOCIADO_JA_POSSUI_CADASTRO');
  }
}