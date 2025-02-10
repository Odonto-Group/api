"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class WebhookPixValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            pagadorCpfCnpj: Validator_1.schema.string(),
            dataPagamento: Validator_1.schema.string(),
            valor: Validator_1.schema.string(),
            pixId: Validator_1.schema.number.optional(),
            pagamentoId: Validator_1.schema.string.optional(),
            pagadorNome: Validator_1.schema.string.optional(),
        });
        this.messages = {};
    }
}
exports.default = WebhookPixValidator;
//# sourceMappingURL=WebhookPixValidator.js.map