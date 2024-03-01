import BaseException from "./BasicLogicalException";

export default class ErroAoEnviarEmailException extends BaseException {
  constructor(email: string) {
    super(`Erro ao tentar enviar email para ${email}.`, 400, '5');
  }
}