"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class WebhookPixValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            data: Validator_1.schema.string(),
            boletoId: Validator_1.schema.number(),
            nossoNumero: Validator_1.schema.number(),
            seuNumero: Validator_1.schema.string.optional(),
            pagadorDocumentoNumero: Validator_1.schema.string(),
            ocorrenciaCodigo: Validator_1.schema.string.optional(),
            ocorrenciaNome: Validator_1.schema.string.optional(),
        });
        this.messages = {};
    }
}
exports.default = WebhookPixValidator;
//# sourceMappingURL=WebhookBoletoValidator.js.map