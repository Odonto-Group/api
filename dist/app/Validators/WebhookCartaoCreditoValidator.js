"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class WebhookPixValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            compradorId: Validator_1.schema.number(),
            compraId: Validator_1.schema.number(),
            pagamentoId: Validator_1.schema.number(),
            nsu: Validator_1.schema.string(),
            autorizacao: Validator_1.schema.string(),
            autorizacaoCodigo: Validator_1.schema.string(),
            cartaoId: Validator_1.schema.string(),
        });
        this.messages = {};
    }
}
exports.default = WebhookPixValidator;
//# sourceMappingURL=WebhookCartaoCreditoValidator.js.map