import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class WebhookPixValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    data: schema.string(),
    boletoId: schema.number(),
    nossoNumero: schema.number(),
    seuNumero: schema.string.optional(),
    pagadorDocumentoNumero: schema.string(),
    ocorrenciaCodigo: schema.string.optional(),
    ocorrenciaNome: schema.string.optional(),
  });

  public messages: CustomMessages = {}
}
