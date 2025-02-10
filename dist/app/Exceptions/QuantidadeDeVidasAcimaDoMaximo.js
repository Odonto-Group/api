"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicLogicalException_1 = __importDefault(require("./BasicLogicalException"));
class QuantidadeDeVidasAcimaDoMaximo extends BasicLogicalException_1.default {
    constructor() {
        super('A quantidade de vidas é maior do que o máximo aceito.', 400, '15');
    }
}
exports.default = QuantidadeDeVidasAcimaDoMaximo;
//# sourceMappingURL=QuantidadeDeVidasAcimaDoMaximo.js.map