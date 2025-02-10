"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicLogicalException_1 = __importDefault(require("./BasicLogicalException"));
class UfInvalidoException extends BasicLogicalException_1.default {
    constructor() {
        super('O Uf recebido é inválido.', 400, '18');
    }
}
exports.default = UfInvalidoException;
//# sourceMappingURL=UfInvalidoException.js.map