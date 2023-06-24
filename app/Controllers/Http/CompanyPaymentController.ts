import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { inject } from '@adonisjs/fold'
import { MailSenderService } from 'App/Services/MailSenderService';
import Env from '@ioc:Adonis/Core/Env'

@inject()
export default class CompanyPaymentController {

  private emailSuporteOdontoGroup = Env.get('EMAIL_ODONTO_GROUP_SUPORTE')
  private emailDefaultTeste = Env.get('EMAIL_ENVIO_DEFAULT')

  constructor(
    private mailSenderService: MailSenderService
  ) {} 

  async index({ request }: HttpContextContract) {
    const params = request.all()

    const planoContent = {
        CNPJ: params.cnpj,
        EMAIL_PARA_CONTATO: params.emailContato, 
        NOME_EMPRESA: params.nomeEmpresa,
        NOME_PARA_CONTATO: params.nomeContato,
        QUANTIDADE_DE_VIDAS: params.quantidadeVidas,
        TELEFONE_PARA_CONTATO: params.telefoneContato
      } as EmpresaPlanoContent;

    await this.mailSenderService.sendEmailEmpresaPlano(this.emailDefaultTeste || this.emailSuporteOdontoGroup, 'Assinatura plano empresarial', planoContent)

    return "Email de adesão empresárial enviado com sucesso."
  }

}
