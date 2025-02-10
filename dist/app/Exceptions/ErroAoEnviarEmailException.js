"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicLogicalException_1 = __importDefault(require("./BasicLogicalException"));
class ErroAoEnviarEmailException extends BasicLogicalException_1.default {
    constructor(email) {
        super(`Erro ao tentar enviar email para ${email}.`, 400, '5');
    }
}
exports.default = ErroAoEnviarEmailException;
//# sourceMappingURL=ErroAoEnviarEmailException.js.map