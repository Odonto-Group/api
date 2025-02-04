"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicLogicalException_1 = __importDefault(require("./BasicLogicalException"));
class MetodoDePagamentoInvalidoException extends BasicLogicalException_1.default {
    constructor() {
        super(`O método de pagamento recebido não é válido`, 400, '8');
    }
}
exports.default = MetodoDePagamentoInvalidoException;
//# sourceMappingURL=MetodoDePagamentoInvalidoException.js.map