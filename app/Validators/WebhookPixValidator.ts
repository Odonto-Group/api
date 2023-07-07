import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class WebhookPixValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    pagadorCpfCnpj: schema.string([
      rules.minLength(11)
    ])
  })

  public messages: CustomMessages = {}
}
