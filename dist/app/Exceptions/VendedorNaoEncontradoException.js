"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicLogicalException_1 = __importDefault(require("./BasicLogicalException"));
class VendedorNaoEncontradoException extends BasicLogicalException_1.default {
    constructor() {
        super('O vendedor nao foi encontrado.', 400, '19');
    }
}
exports.default = VendedorNaoEncontradoException;
//# sourceMappingURL=VendedorNaoEncontradoException.js.map