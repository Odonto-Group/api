"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicLogicalException_1 = __importDefault(require("./BasicLogicalException"));
class OrgaoExpedidorInvalido extends BasicLogicalException_1.default {
    constructor() {
        super(`Orgão Expedidor é inválido`, 400, '12');
    }
}
exports.default = OrgaoExpedidorInvalido;
//# sourceMappingURL=OrgaoExpedidorInvalido.js.map