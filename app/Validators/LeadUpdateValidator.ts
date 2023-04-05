import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LeadUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    lead: schema.number([
      rules.exists({ table: 'tb_leads', column: 'id_leads' })
    ]),
    status_primario: schema.array().members(   
      schema.number()
    ),
    status_secundario: schema.array().members(   
      schema.number()
    ),
    mensagem: schema.string.optional(),
  })

  public messages: CustomMessages = {}
}
