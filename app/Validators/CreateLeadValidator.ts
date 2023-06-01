import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateLeadValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    nome: schema.string(),
    email: schema.string.optional(),
    cpf: schema.string.optional(),
    cep: schema.string.optional(),
    data_nascimento: schema.date.optional({ format: 'yyyy/MM/dd' }),
    telefone: schema.number(),
    origem: schema.number(),
  })

  public messages: CustomMessages = {}
}
