"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicLogicalException_1 = __importDefault(require("./BasicLogicalException"));
class TokenInvalidoException extends BasicLogicalException_1.default {
    constructor() {
        super('O token recebido é inválido.', 400, '17');
    }
}
exports.default = TokenInvalidoException;
//# sourceMappingURL=TokenInvalidoException.js.map