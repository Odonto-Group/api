import BaseException from "./BasicLogicalException";

export default class ServidorNaoEncontrado extends BaseException {
  constructor() {
    super('As informações não são suficientes para sua identificação como servidor do GDF;\n Entre em contato Conosco pelo 40072028', 400, '13');
  }
}