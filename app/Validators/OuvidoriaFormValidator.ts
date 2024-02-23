import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules, type CustomMessages } from '@ioc:Adonis/Core/Validator';

export default class OuvidoriaFormValidator {
  constructor(protected ctx: HttpContextContract) { }
  public schema = schema.create({
    name: schema.string(),
    phone: schema.string.optional([rules.mobile()]),
    subject: schema.string(),
    email: schema.string([rules.email()]),
    protocol: schema.string([rules.alphaNum()]),
    message: schema.string()
  });

  public messages: CustomMessages = {
    'name.required': 'Nome obrigatório.',
    'phone.mobile': 'Telefone inválido.',
    'subject.required': 'Assunto obrigatório.',
    'email.required': 'Email obrigatório.',
    'email.email': 'Email inválido.',
    'protocol.required': 'Protocolo obrigatório.',
    'message.required': 'Mensagem é obrigatória.'
  };
}