const { LogicalException } = require('@adonisjs/generic-exceptions');

export default class AssociadoComPlanoJaCadastrado extends LogicalException {
  constructor() {
    super('Associado já tem plano cadastrado! Por favor, entre em contato com a nossa central 40071087', 400);
    this.code = 'ASSOCIADO_JA_POSSUI_PLANO_CADATRADO';
  }
}