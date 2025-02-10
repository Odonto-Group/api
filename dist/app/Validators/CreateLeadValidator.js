"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class CreateLeadValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            nome: Validator_1.schema.string(),
            email: Validator_1.schema.string.optional(),
            cpf: Validator_1.schema.string.optional(),
            cep: Validator_1.schema.string.optional(),
            data_nascimento: Validator_1.schema.date.optional({ format: 'yyyy/MM/dd' }),
            telefone: Validator_1.schema.number(),
            origem: Validator_1.schema.number(),
        });
        this.messages = {};
    }
}
exports.default = CreateLeadValidator;
//# sourceMappingURL=CreateLeadValidator.js.map