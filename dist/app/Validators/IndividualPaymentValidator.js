"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class PayloadValidator {
    constructor() {
        this.schema = Validator_1.schema.create({
            token: Validator_1.schema.string(),
            cpf: Validator_1.schema.string({}, [Validator_1.rules.minLength(11), Validator_1.rules.regex(/^\d{11}$/)]),
            idBanco: Validator_1.schema.string.optional(),
            conta: Validator_1.schema.string.optional(),
            agencia: Validator_1.schema.string.optional(),
            nomeTitular: Validator_1.schema.string(),
            dataNascimento: Validator_1.schema.string(),
            emailTitular: Validator_1.schema.string(),
            cep: Validator_1.schema.string(),
            orgao: Validator_1.schema.number.optional(),
            idUf: Validator_1.schema.number(),
            primeiraBoleto: Validator_1.schema.boolean.optional(),
            endereco: Validator_1.schema.string(),
            numeroCasa: Validator_1.schema.string(),
            complemento: Validator_1.schema.string.optional(),
            bairro: Validator_1.schema.string(),
            cidade: Validator_1.schema.string(),
            celular: Validator_1.schema.string(),
            nomeMae: Validator_1.schema.string(),
            cns: Validator_1.schema.string.optional(),
            rg: Validator_1.schema.string.optional(),
            idSexo: Validator_1.schema.number(),
            idEstadoCivil: Validator_1.schema.number(),
            idFontePagadora: Validator_1.schema.number.optional(),
            idOrgaoExpedidor: Validator_1.schema.number(),
            idOrgaoExpedidorUf: Validator_1.schema.number(),
            perfil: Validator_1.schema.string.optional(),
            matricula: Validator_1.schema.string.optional(),
            cargo: Validator_1.schema.string.optional(),
            formaPagamento: Validator_1.schema.object().members({
                gpPagto: Validator_1.schema.number(),
                idPagto: Validator_1.schema.number(),
            }),
            vencimentoDebito: Validator_1.schema.string.optional(),
            vencimentoBoleto: Validator_1.schema.string.optional(),
            dependentes: Validator_1.schema.array.optional().members(Validator_1.schema.object().members({
                nome: Validator_1.schema.string(),
                cpf: Validator_1.schema.string({}, [Validator_1.rules.minLength(11), Validator_1.rules.regex(/^\d{11}$/)]),
                rg: Validator_1.schema.string.optional(),
                idOrgaoExpedidor: Validator_1.schema.number(),
                idOrgaoExpedidorUf: Validator_1.schema.number(),
                cns: Validator_1.schema.string.optional(),
                dataNascimento: Validator_1.schema.string(),
                nomeMae: Validator_1.schema.string(),
                idSexo: Validator_1.schema.number(),
                idParentesco: Validator_1.schema.number(),
            })),
            responsavelFinanceiro: Validator_1.schema.object().members({
                cpf: Validator_1.schema.string({}, [Validator_1.rules.minLength(11), Validator_1.rules.regex(/^\d{11}$/)]),
                nome: Validator_1.schema.string(),
                dataNascimento: Validator_1.schema.string(),
                email: Validator_1.schema.string(),
                cep: Validator_1.schema.string(),
                endereco: Validator_1.schema.string(),
                cidade: Validator_1.schema.string(),
                numero: Validator_1.schema.string(),
                complemento: Validator_1.schema.string.optional(),
                bairro: Validator_1.schema.string(),
                idUf: Validator_1.schema.number(),
                telefone: Validator_1.schema.string(),
            }),
            cartaoCredito: Validator_1.schema.object.optional().members({
                codigoSeguranca: Validator_1.schema.string(),
                numero: Validator_1.schema.string(),
                nome: Validator_1.schema.string(),
                expiracao: Validator_1.schema.string(),
                bandeira: Validator_1.schema.string.optional(),
            }),
        });
    }
}
exports.default = PayloadValidator;
//# sourceMappingURL=IndividualPaymentValidator.js.map