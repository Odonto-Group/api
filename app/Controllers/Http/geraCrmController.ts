import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { inject } from '@adonisjs/fold';
import { MailSenderService } from 'App/Services/MailSenderService';
import CRMS4eService from 'App/Services/CRMS4eService';
import CreateCrmValidator from 'App/Validators/CreateCrmValidator';
import CrmEmailContent from 'App/interfaces/CrmEmailContent.interface';

@inject()
export default class geraCrmController {
  constructor(
    private readonly mailService: MailSenderService,
    private readonly crmService: CRMS4eService
  ) { }

  async index({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateCrmValidator);

    const descricao = 'Solicitação Fale Conosco Web Site';
    const descricaoOcorrencia = `usdhfhas ${data.motivoDetalhado}`; 
    const motivoDetalhado = data.motivoDetalhado;
    const usuario = data.usuario;
    const solicitante = data.solicitante;

    const tipoSolicitante = 2;
    const tipousuario = 1;


    const CRM = await this.crmService.includeCRM(descricao, descricaoOcorrencia, usuario, motivoDetalhado, tipousuario, tipoSolicitante, solicitante);
    const CrmContent = {
        NOMECLIENTE: data.nome,
        PROTOCOLO: CRM.protocolo,
        ENVIO: descricaoOcorrencia
    } as CrmEmailContent
    await this.mailService.sendCrmCliente(data.email, CrmContent);
    return response.json({ message: 'Mensagem enviada!' });
  }
}
