"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicLogicalException_1 = __importDefault(require("./BasicLogicalException"));
class PlanoNaoEncontrado extends BasicLogicalException_1.default {
    constructor() {
        super('O plano não foi encontrado', 400, '13');
    }
}
exports.default = PlanoNaoEncontrado;
//# sourceMappingURL=PlanoNaoEncontrado.js.map