import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class WebhookPixValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    compradorId: schema.number(),
    compraId: schema.number(),
    pagamentoId: schema.number(),
    nsu: schema.string(),
    autorizacao: schema.string(),
    autorizacaoCodigo: schema.string(),
    cartaoId: schema.string(),
  });

  public messages: CustomMessages = {}
}
