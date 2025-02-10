"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicLogicalException_1 = __importDefault(require("./BasicLogicalException"));
class AssociadoComPlanoJaCadastrado extends BasicLogicalException_1.default {
    constructor() {
        super('Associado já possui cadastro! Por favor, entre em contato com a nossa central 4007-1087', 400, '1');
    }
}
exports.default = AssociadoComPlanoJaCadastrado;
//# sourceMappingURL=AssociadoComPlanoJaCadastrado.js.map