"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicLogicalException_1 = __importDefault(require("./BasicLogicalException"));
class EmpresaComPlanoJaCadastrado extends BasicLogicalException_1.default {
    constructor() {
        super('Empresa já possui cadastro! Por favor, entre em contato com a nossa central 40071087', 400, '4');
    }
}
exports.default = EmpresaComPlanoJaCadastrado;
//# sourceMappingURL=EmpresaComPlanoJaCadastrado.js.map