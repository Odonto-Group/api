"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicLogicalException_1 = __importDefault(require("./BasicLogicalException"));
class DataExpiracaoInvalida extends BasicLogicalException_1.default {
    constructor() {
        super('Data de expiracão é inválida', 400, '2');
    }
}
exports.default = DataExpiracaoInvalida;
//# sourceMappingURL=DataExpiracaoInvalida.js.map