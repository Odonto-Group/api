"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicLogicalException_1 = __importDefault(require("./BasicLogicalException"));
class FormaPagamentoNaoEncontrada extends BasicLogicalException_1.default {
    constructor() {
        super('Não foi encontrada uma forma de pagamento', 400, '7');
    }
}
exports.default = FormaPagamentoNaoEncontrada;
//# sourceMappingURL=FormaPagamentoNaoEncontrada.js.map