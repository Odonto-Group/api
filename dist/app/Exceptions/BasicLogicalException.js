"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_exceptions_1 = require("@adonisjs/generic-exceptions");
class BaseException extends generic_exceptions_1.LogicalException {
    constructor(message, status, code) {
        super(message, status);
        this.code = code;
    }
    handle(error, { response }) {
        response
            .status(this.status)
            .send({
            error: this.message,
            code: this.code
        });
    }
}
exports.default = BaseException;
//# sourceMappingURL=BasicLogicalException.js.map