"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class LoginValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            cpf: Validator_1.schema.string([
                Validator_1.rules.minLength(11)
            ]),
            password: Validator_1.schema.string([
                Validator_1.rules.minLength(6)
            ]),
        });
        this.messages = {};
    }
}
exports.default = LoginValidator;
//# sourceMappingURL=LoginValidator.js.map