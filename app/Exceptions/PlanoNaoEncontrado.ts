import BaseException from "./BasicLogicalException";

export default class PlanoNaoEncontrado extends BaseException {
  constructor() {
    super('O plano não foi encontrado', 400, 'PLANO_NAO_ENCONTRADO');
  }
}