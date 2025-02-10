"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicLogicalException_1 = __importDefault(require("./BasicLogicalException"));
class NaoFoiPossivelGerarPagamentoCartaoException extends BasicLogicalException_1.default {
    constructor() {
        super('Não foi possivel gerar o pagamento cartão de crédito.', 400, '11');
    }
}
exports.default = NaoFoiPossivelGerarPagamentoCartaoException;
//# sourceMappingURL=NaoFoiPossivelGerarPagamentoCartaoException.js.map