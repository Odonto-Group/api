import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class WebhookPixValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    pagadorCpfCnpj: schema.string(),
    dataPagamento: schema.string(),
    valor: schema.string(),
    pixId: schema.number.optional(),
    pagamentoId: schema.string.optional(),
    pagadorNome: schema.string.optional(),
  });

  public messages: CustomMessages = {}
}
