import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BuscarPlanoValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    state:schema.string([
      rules.minLength(2),
      require
    ]),
    
    token: schema.string([
      rules.minLength(7)
    ]),
  })

  public messages: CustomMessages = {}
}
