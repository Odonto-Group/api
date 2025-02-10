"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicLogicalException_1 = __importDefault(require("./BasicLogicalException"));
class NaoFoiPossivelCriarPagamento extends BasicLogicalException_1.default {
    constructor() {
        super('Não foi possivel criar pagamento.', 400, '9');
    }
}
exports.default = NaoFoiPossivelCriarPagamento;
//# sourceMappingURL=NaoFoiPossivelEfetuarPagamento.js.map