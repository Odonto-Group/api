"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class LeadUpdateValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            lead: Validator_1.schema.number([
                Validator_1.rules.exists({ table: 'tb_leads', column: 'id_leads' })
            ]),
            status_primario: Validator_1.schema.array().members(Validator_1.schema.number()),
            status_secundario: Validator_1.schema.array().members(Validator_1.schema.number()),
            mensagem: Validator_1.schema.string.optional(),
        });
        this.messages = {};
    }
}
exports.default = LeadUpdateValidator;
//# sourceMappingURL=LeadUpdateValidator.js.map