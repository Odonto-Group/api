"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicLogicalException_1 = __importDefault(require("./BasicLogicalException"));
class DocumentoPessoaInvalido extends BasicLogicalException_1.default {
    constructor() {
        super('Documento do associado inválido', 400, '3');
    }
}
exports.default = DocumentoPessoaInvalido;
//# sourceMappingURL=DocumentoPessoaInvalido.js.map