import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { inject } from '@adonisjs/fold';
import AdesaoEmailContent from 'App/interfaces/AdesaoEmailContent.interface';
import formatNumberBrValue from 'App/utils/FormatNumber';
import { FormaPagamento } from 'App/Enums/FormaPagamento';
import { MailSenderService } from 'App/Services/MailSenderService';
import TbAssociado from 'App/Models/TbAssociado';
import { GrupoPagamento } from 'App/Enums/GrupoPagamento';
import ErroEmailContent from 'App/interfaces/ErroEmailContent.interface';
import AssociadoService from 'App/Services/AssociadoService';

@inject()
export default class SendMailController {
  constructor(
    private readonly mailService: MailSenderService,
    private associadoService: AssociadoService
  ) { }

  async sendMailGdfTest({ response }: HttpContextContract) {
    
    const planoContent = { 
      NOMEPLANO: 'nomePlano',
      DATAVENCIMENTO: '01/01/2025',
      NOMECLIENTE: 'teste de Envio de email',
      LINKPAGAMENTO: '1589954',
      VALORPLANO: formatNumberBrValue(30),
      METODOPAGAMENTO: FormaPagamento.CONSIGNADO
    } as AdesaoEmailContent;
    try{
      await this.mailService.sendEmailAdesaoConsignado('erick.calza@odontogroup.com.br', 'Bem-vindo à OdontoGroup.', 993, [ 994, 998, 999, 1000 ], planoContent);
      return response.json('ok');
    } catch(error) {
      return response.json(error)
    }
  }

  async ErrorMail({ request, response }: HttpContextContract){
    const params =  request.all();
    const cpf = params.cpf.replace('.', '').replace('-', '');
    const associado = await this.associadoService.findAssociadoByCpf(cpf);
    try{
      await this.mailService.sendMailError(associado, Number(params.grupo), '1732491469');
      return response.json('ok');
    } catch(error) {
      console.log(error.message);
      return response.json(error.message);
    }
  }
}


