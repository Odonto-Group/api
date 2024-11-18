"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicLogicalException_1 = __importDefault(require("./BasicLogicalException"));
class ErroInclusaoAssociadoS4EException extends BasicLogicalException_1.default {
    constructor() {
        super(`Erro ao incluiar associado.`, 400, '6');
    }
}
exports.default = ErroInclusaoAssociadoS4EException;
//# sourceMappingURL=ErroInclusaoAssociadoS4EException.js.map