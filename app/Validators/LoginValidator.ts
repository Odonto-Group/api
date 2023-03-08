import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    cpf:schema.string([
      rules.minLength(11)
    ]),
    
    password: schema.string([
      rules.minLength(6)
    ]),
  })

  public messages: CustomMessages = {}
}
