import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CompanyPaymentValidator {
  public schema = schema.create({
    token: schema.string(),
    vencimentoBoleto: schema.string(),
    responsavelEmpresa: schema.object().members({
      nome: schema.string(),
      cpf: schema.string({}, [
        rules.minLength(11),
        rules.regex(/^\d{11}$/),
      ]),
      dataNascimento: schema.string(),
      email: schema.string(),
      telefone: schema.string(),
    }),
    empresa: schema.object().members({
      cnpj: schema.string(),
      razaoSocial: schema.string(),
      nomeFantasia: schema.string(),
      inscricaoEstadual: schema.string(),
      quantidadeFuncionarios: schema.number(),
      nomeResponsavel: schema.string(),
      cpfResponsavel: schema.string({}, [
        rules.minLength(8),
        rules.regex(/^\d{8}$/),
      ]),
      email: schema.string(),
      dddFixo: schema.string(),
      telefoneFixo: schema.string(),
      dddCelular: schema.string(),
      celular: schema.string(),
      cep: schema.string(),
      logradouro: schema.string(),
      numero: schema.number(),
      complemento: schema.string.optional(),
      bairro: schema.string(),
      cidade: schema.string(),
      idPatrocinio: schema.number(),
      idUf: schema.number(),
    }),
    funcionarios: schema.array().members(
      schema.object().members({
        nome: schema.string(),
        cpf: schema.string({}, [
          rules.minLength(11),
          rules.regex(/^\d{11}$/),
        ]),
        cns: schema.string.optional(),
        rg: schema.string.optional(),
        idOrgaoExpedidor: schema.number(),
        dataNascimento: schema.string(),
        idSexo: schema.number(),
        idParentesco: schema.number(),
        nomeMae: schema.string(),
        dddFixo: schema.string(),
        telefoneFixo: schema.string(),
        dddCelular: schema.string(),
        celular: schema.string(),
        email: schema.string(),
        matriculaFuncional: schema.string(),
        idUf: schema.number(),
        cep: schema.string(),
        logradouro: schema.string(),
        numero: schema.number(),
        complemento: schema.string.optional(),
        bairro: schema.string(),
        cidade: schema.string(),
        dependentes: schema.array().members(
          schema.object().members({
            cpf: schema.string({}, [
              rules.minLength(11),
              rules.regex(/^\d{11}$/),
            ]),
            rg: schema.string(),
            idOrgaoExpedidor: schema.number(),
            cns: schema.string(),
            nomeMae: schema.string(),
            idSexo: schema.number(),
            idParentesco: schema.number(),
            nome: schema.string(),
            dataNascimento: schema.string(),
            email: schema.string(),
            documentoVinculo: schema.string(),
          })
        ),
      })
    ),
  })
}