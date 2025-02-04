import BaseException from "./BasicLogicalException";

export default class ErroConsultaCepS4EException extends BaseException {
  constructor() {
    super(`Erro ao consultar o cep, verifique o Cep e tente novamente.`, 400, '6');
  }
}