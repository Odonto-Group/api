import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { inject } from '@adonisjs/fold'
import PagamentoCartaoService from 'App/Services/PagamentoCartaoService';
import Database from '@ioc:Adonis/Lucid/Database';
import PagamentoBoletoService from 'App/Services/PagamentoBoletoService';
import AssociadoService from 'App/Services/AssociadoService';
import PagamentoCartaoOdontoCobService from 'App/Services/PagamentoCartaoOdontoCobService';
import PagamentoBoletoOdontoCobService from 'App/Services/PagamentoBoletoOdontoCobService';
import PagamentoPixOdontoCobService from 'App/Services/PagamentoPixOdontoCobService';
import PagamentoPixService from 'App/Services/PagamentoPixService';
import { MailSenderService } from 'App/Services/MailSenderService';
import { FormaPagamento } from 'App/Enums/FormaPagamento';
import ErroEmailContent from 'App/interfaces/ErroEmailContent.interface';
import Env from '@ioc:Adonis/Core/Env'
import SmsService from 'App/Services/SmsService';
import TbAssociado from 'App/Models/TbAssociado';
import TbResponsavelFinanceiro from 'App/Models/TbResponsavelFinanceiro';

@inject()
export default class WebhookController {

  private emailSuporteOdontoGroup = Env.get('EMAIL_ODONTO_GROUP_SUPORTE')
  private emailDefaultTeste = Env.get('EMAIL_ENVIO_DEFAULT')

  constructor(
    private pagamentoCartaoService: PagamentoCartaoService,
    private pagamentoBoletoService: PagamentoBoletoService,
    private pagamentoPixService: PagamentoPixService,
    private associadoService: AssociadoService,
    private pagamentoCartaoOdontoCobService: PagamentoCartaoOdontoCobService,
    private pagamentoBoletoOdontoCobService: PagamentoBoletoOdontoCobService,
    private pagamentoPixOdontoCobService: PagamentoPixOdontoCobService,
    private mailSenderService: MailSenderService,
    private smsService: SmsService
  ) {} 

  async index({ request }: HttpContextContract) {

    const params = request.all()

    await Database.transaction(async (transaction) => {
        try {
            const associado = await this.associadoService.findAssociadoByNossoNumeroBoleto(params.nossoNumero);

            if (associado.cd_status && associado.cd_status != 0  && associado.cd_status != 2) {

                const pagamentoOdontoCob = await this.pagamentoBoletoOdontoCobService.savePagamentoEfetuadoOdontoCob(associado, params, transaction);

                await this.associadoService.updateAssociadoPagamentoEfetuado(associado)

                await this.pagamentoBoletoService.savePagamentoEfetuado(associado, params, pagamentoOdontoCob, transaction);

                const responsavelFinanceiro = associado.responsavelFinanceiro[0];

                await this.enviarEmailPagamento(associado, responsavelFinanceiro);

                this.smsService.enviaSmsResponsavelPagamentoEfetuado(responsavelFinanceiro, associado)
            } else {
                const planoContent = {
                  NOMECLIENTE: associado.nm_associado,
                  TIPO_PAGAMENTO: FormaPagamento.BOLETO
                } as ErroEmailContent;
      
                await this.mailSenderService.sendEmailErro(this.emailDefaultTeste || this.emailSuporteOdontoGroup, 'Erro pagamento OdontoGroup.', planoContent)
            }

            transaction.commit();
        } catch (error) {
            transaction.rollback();
            throw error;
        }
        })
  }

  async creditCardPayment({ request }: HttpContextContract) {
    const params = request.all()

    await Database.transaction(async (transaction) => {
        try {
          const associado = await this.associadoService.findAssociadoById(params.compradorId);

          if (associado.cd_status && associado.cd_status != 0  && associado.cd_status != 2) {

            await this.pagamentoCartaoOdontoCobService.savePagamentoEfetuadoOdontoCob(associado, params, transaction);

            await this.associadoService.updateAssociadoPagamentoEfetuado(associado)

            await this.pagamentoCartaoService.savePagamentoEfetuado(associado, params, transaction);

            const responsavelFinanceiro = associado.responsavelFinanceiro[0];

            await this.enviarEmailPagamento(associado, responsavelFinanceiro);

            this.smsService.enviaSmsResponsavelPagamentoEfetuado(responsavelFinanceiro, associado)
          } else {
            const planoContent = {
              NOMECLIENTE: associado.nm_associado,
              TIPO_PAGAMENTO: FormaPagamento.CARTAO_CREDITO
            } as ErroEmailContent;
  
            await this.mailSenderService.sendEmailErro(this.emailDefaultTeste || this.emailSuporteOdontoGroup, 'Erro pagamento OdontoGroup.', planoContent)
          }

          transaction.commit();
        } catch (error) {
          transaction.rollback();
          throw error;
        }
      })
  }

  async pixPayment({ request }: HttpContextContract) {
    const params = request.all()

    await Database.transaction(async (transaction) => {
      try {
        const associado = await this.associadoService.findAssociadoByCpf(params.pagadorCpfCnpj);

        if (associado.cd_status && associado.cd_status != 0  && associado.cd_status != 2) {

          const pix = await this.pagamentoPixOdontoCobService.savePagamentoEfetuadoOdontoCob(associado, params, transaction);

          await this.associadoService.updateAssociadoPagamentoEfetuado(associado)

          await this.pagamentoPixService.savePagamentoEfetuado(associado, params, pix, transaction);

          const responsavelFinanceiro = associado.responsavelFinanceiro[0];

          await this.enviarEmailPagamento(associado, responsavelFinanceiro);

          this.smsService.enviaSmsResponsavelPagamentoEfetuado(responsavelFinanceiro, associado)
        } else {
          const planoContent = {
            NOMECLIENTE: associado.nm_associado,
            TIPO_PAGAMENTO: FormaPagamento.PIX
          } as ErroEmailContent;

          await this.mailSenderService.sendEmailErro(this.emailDefaultTeste || this.emailSuporteOdontoGroup, 'Erro pagamento OdontoGroup.', planoContent)
        }

        transaction.commit();
      } catch (error) {
        transaction.rollback();
        throw error;
      }
    })
  }

  async enviarEmailPagamento(associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro) {
    const planoContent = {
      NOMECLIENTE: associado.nm_associado
    } as PagamentoEmailContent;

    await this.mailSenderService.sendEmailPagamentoAprovado(this.emailDefaultTeste || responsavelFinanceiro.ds_emailRespFin, 'Bem-vindo à OdontoGroup.', associado.id_prodcomerc_a, planoContent);
  }
  
}
