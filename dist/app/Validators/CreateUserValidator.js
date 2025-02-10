"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class CreateUserValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            cpf: Validator_1.schema.string([
                Validator_1.rules.unique({ table: 'users', column: 'cpf' }),
                Validator_1.rules.minLength(11)
            ]),
            name: Validator_1.schema.string(),
            email: Validator_1.schema.string([
                Validator_1.rules.email(),
                Validator_1.rules.unique({ table: 'users', column: 'email' }),
            ]),
            password: Validator_1.schema.string([
                Validator_1.rules.minLength(6)
            ]),
            remember_me_token: Validator_1.schema.string.optional(),
        });
        this.messages = {};
    }
}
exports.default = CreateUserValidator;
//# sourceMappingURL=CreateUserValidator.js.map