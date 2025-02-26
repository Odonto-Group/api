import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules, type CustomMessages } from '@ioc:Adonis/Core/Validator';

export default class CreateCrmValidator {
  constructor(protected ctx: HttpContextContract) { }
  public schema = schema.create({
    nome: schema.string(),
    email: schema.string(),
    usuario: schema.number(),
    motivoDetalhado: schema.number(),
    subject: schema.string(),
    solicitante: schema.number(),
    descricaoOcorrencia: schema.string()
  });

  public messages: CustomMessages = {
    'nome.required': 'nome é obrigatório.',
    'email.required': 'email é obrigatório.',
    'usuario.required': 'Usuário obrigatório.',
    'motivoDetalhado.required': 'motivoDetalhado é obrigatório.',
    'subject.required': 'subject é obrigatório.',
    'solicitante.required': 'solicitante é obrigatório.',
    'descricaoOcorrencia.required': 'descricaoOcorrencia é obrigatória.'
  };
}