import BaseException from "./BasicLogicalException";

export default class EmpresaComPlanoJaCadastrado extends BaseException {
  constructor() {
    super('Empresa já possui cadastro! Por favor, entre em contato com a nossa central 40071087', 400, '4');
  }
}