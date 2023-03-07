import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    cpf:schema.string([
      rules.unique({ table: 'users', column: 'cpf' }),
      rules.minLength(11)
    ]),
    name: schema.string(),
    email: schema.string([
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    password: schema.string([
      rules.minLength(6)
    ]),
    remember_me_token: schema.string.optional(),
  })

  public messages: CustomMessages = {}
}
