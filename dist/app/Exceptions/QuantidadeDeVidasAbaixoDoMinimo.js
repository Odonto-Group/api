"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicLogicalException_1 = __importDefault(require("./BasicLogicalException"));
class QuantidadeDeVidasAbaixoDoMinimo extends BasicLogicalException_1.default {
    constructor() {
        super('A quantidade de vidas é menor do que o mínimo aceito.', 400, '14');
    }
}
exports.default = QuantidadeDeVidasAbaixoDoMinimo;
//# sourceMappingURL=QuantidadeDeVidasAbaixoDoMinimo.js.map