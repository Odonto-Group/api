"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicLogicalException_1 = __importDefault(require("./BasicLogicalException"));
class SituacaoPagamentoCartaoDesconhecidaException extends BasicLogicalException_1.default {
    constructor() {
        super('A situação de pagamento inválida.', 400, '16');
    }
}
exports.default = SituacaoPagamentoCartaoDesconhecidaException;
//# sourceMappingURL=SituacaoPagamentoCartaoDesconhecidaException.js.map