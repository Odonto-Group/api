import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { inject } from '@adonisjs/fold';
import AdesaoEmailContent from 'App/interfaces/AdesaoEmailContent.interface';
import formatNumberBrValue from 'App/utils/FormatNumber';
import { FormaPagamento } from 'App/Enums/FormaPagamento';
import { MailSenderService } from 'App/Services/MailSenderService';
import AssociadoService from 'App/Services/AssociadoService';
import ProdutoComercialService from 'App/Services/ProdutoComercialService';
import ApiV3Service from 'App/Services/ApiV3';
import formatDateToBrazil from 'App/utils/formatDate';

@inject()
export default class SendMailController {
  constructor(
    private readonly mailService: MailSenderService,
    private readonly produtoService: ProdutoComercialService,
    private readonly ApiV3: ApiV3Service,
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
  async sendMailUser({ request, response }: HttpContextContract) {
    const params =  request.all();
    const cpf = params.cpf.replace('.', '').replace('-', '');
    try{
      await this.mailService.getmailGDF(cpf);
      return response.json('ok');
    } catch(error) {
      throw new Error('não foi possivel enviar o email' + error.message);
    }
  }
  async sendMailAllUsers({ request, response }: HttpContextContract) {
    const Associados = await this.ApiV3.getAssocsMail();
    const count = Associados.dados.length;
    console.log('quantidade: ', count);
    if (Associados){
      for (const Associado of Associados.dados){
        const cpf = Associado.CPF.replace('.', '').replace('-', '');
        try{          
          //console.log('passou aqui :', cpf);
          await this.mailService.getmailGDF(cpf);
        } catch(error) {
          throw new Error('não foi possivel enviar o email' + error.message);
        }
      }
      
      return response.json('emails envioados total: ' + count);
    }    
  }

  async ErrorMail({ request, response }: HttpContextContract){
    const params =  request.all();
    const cpf = params.cpf.replace('.', '').replace('-', '');
    try{
      const associado = await this.associadoService.findAssociadoByCpf(cpf);
      await this.mailService.sendMailError(associado, Number(params.grupo), '1732491469');
      return response.json('ok');
    } catch(error) {
      console.log(error.message);
      return response.json(error.message);
    }
  }

  async getPlano(plano) {
    try {
      const planoData = await this.produtoService.getById(plano);
      if(planoData){
        return planoData;
      } else {
        throw Error('Plano Não encontrado.' + plano);
      }
    } catch (error) {
      console.error("Erro ao buscar o plano:", error);
      throw Error('Plano Não encontrado.' + plano);
    }
  }
  async getPlanoS4e(plano) {
    try {
      const planoData = await this.produtoService.getByS4eId(plano);
      if(planoData){
        return planoData;
      } else {
        throw Error('Plano Não encontrado.' + plano);
      }
    } catch (error) {
      console.error("Erro ao buscar o plano:", error);
      throw Error('Plano Não encontrado.' + plano);
    }
  }
}


