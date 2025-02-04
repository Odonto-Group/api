"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class OuvidoriaFormValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            name: Validator_1.schema.string(),
            phone: Validator_1.schema.string.optional([Validator_1.rules.mobile()]),
            subject: Validator_1.schema.string(),
            email: Validator_1.schema.string([Validator_1.rules.email()]),
            protocol: Validator_1.schema.string([Validator_1.rules.alphaNum()]),
            message: Validator_1.schema.string()
        });
        this.messages = {
            'name.required': 'Nome obrigatório.',
            'phone.mobile': 'Telefone inválido.',
            'subject.required': 'Assunto obrigatório.',
            'email.required': 'Email obrigatório.',
            'email.email': 'Email inválido.',
            'protocol.required': 'Protocolo obrigatório.',
            'message.required': 'Mensagem é obrigatória.'
        };
    }
}
exports.default = OuvidoriaFormValidator;
//# sourceMappingURL=OuvidoriaFormValidator.js.map