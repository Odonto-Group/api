"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class CompanyPaymentValidator {
    constructor() {
        this.schema = Validator_1.schema.create({
            token: Validator_1.schema.string(),
            vencimentoBoleto: Validator_1.schema.string(),
            responsavelEmpresa: Validator_1.schema.object().members({
                nome: Validator_1.schema.string(),
                cpf: Validator_1.schema.string({}, [
                    Validator_1.rules.minLength(11),
                    Validator_1.rules.regex(/^\d{11}$/),
                ]),
                dataNascimento: Validator_1.schema.string(),
                email: Validator_1.schema.string(),
                telefone: Validator_1.schema.string(),
            }),
            empresa: Validator_1.schema.object().members({
                cnpj: Validator_1.schema.string(),
                razaoSocial: Validator_1.schema.string(),
                nomeFantasia: Validator_1.schema.string(),
                inscricaoEstadual: Validator_1.schema.string(),
                quantidadeFuncionarios: Validator_1.schema.number(),
                nomeResponsavel: Validator_1.schema.string(),
                cpfResponsavel: Validator_1.schema.string({}, [
                    Validator_1.rules.minLength(8),
                    Validator_1.rules.regex(/^\d{8}$/),
                ]),
                email: Validator_1.schema.string(),
                dddFixo: Validator_1.schema.string(),
                telefoneFixo: Validator_1.schema.string(),
                dddCelular: Validator_1.schema.string(),
                celular: Validator_1.schema.string(),
                cep: Validator_1.schema.string(),
                logradouro: Validator_1.schema.string(),
                numero: Validator_1.schema.number(),
                complemento: Validator_1.schema.string.optional(),
                bairro: Validator_1.schema.string(),
                cidade: Validator_1.schema.string(),
                idPatrocinio: Validator_1.schema.number(),
                idUf: Validator_1.schema.number(),
            }),
            funcionarios: Validator_1.schema.array().members(Validator_1.schema.object().members({
                nome: Validator_1.schema.string(),
                cpf: Validator_1.schema.string({}, [
                    Validator_1.rules.minLength(11),
                    Validator_1.rules.regex(/^\d{11}$/),
                ]),
                cns: Validator_1.schema.string.optional(),
                rg: Validator_1.schema.string.optional(),
                idOrgaoExpedidor: Validator_1.schema.number(),
                dataNascimento: Validator_1.schema.string(),
                idSexo: Validator_1.schema.number(),
                idParentesco: Validator_1.schema.number(),
                nomeMae: Validator_1.schema.string(),
                dddFixo: Validator_1.schema.string(),
                telefoneFixo: Validator_1.schema.string(),
                dddCelular: Validator_1.schema.string(),
                celular: Validator_1.schema.string(),
                email: Validator_1.schema.string(),
                matriculaFuncional: Validator_1.schema.string(),
                idUf: Validator_1.schema.number(),
                cep: Validator_1.schema.string(),
                logradouro: Validator_1.schema.string(),
                numero: Validator_1.schema.number(),
                complemento: Validator_1.schema.string.optional(),
                bairro: Validator_1.schema.string(),
                cidade: Validator_1.schema.string(),
                dependentes: Validator_1.schema.array().members(Validator_1.schema.object().members({
                    cpf: Validator_1.schema.string({}, [
                        Validator_1.rules.minLength(11),
                        Validator_1.rules.regex(/^\d{11}$/),
                    ]),
                    rg: Validator_1.schema.string(),
                    idOrgaoExpedidor: Validator_1.schema.number(),
                    cns: Validator_1.schema.string(),
                    nomeMae: Validator_1.schema.string(),
                    idSexo: Validator_1.schema.number(),
                    idParentesco: Validator_1.schema.number(),
                    nome: Validator_1.schema.string(),
                    dataNascimento: Validator_1.schema.string(),
                    email: Validator_1.schema.string(),
                    documentoVinculo: Validator_1.schema.string(),
                })),
            })),
        });
    }
}
exports.default = CompanyPaymentValidator;
//# sourceMappingURL=CompanyPaymentValidator.js.map