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
import SmsService from 'App/Services/SmsService';
import TbAssociado from 'App/Models/TbAssociado';
import TbResponsavelFinanceiro from 'App/Models/TbResponsavelFinanceiro';
import WebhookPixValidator from 'App/Validators/WebhookPixValidator';
import WebhookBoletoValidator from 'App/Validators/WebhookBoletoValidator';
import WebhookCartaoCreditoValidator from 'App/Validators/WebhookCartaoCreditoValidator';
import ConfirmacaoPagamentoPix from 'App/Services/Fluxo/Confimacao/Pagamento/ConfirmacaoPagamentoPix';
import ConfirmacaoPagamentoCartaoCredito from 'App/Services/Fluxo/Confimacao/Pagamento/ConfirmacaoPagamentoCartaoCredito';
import ConfirmacaoPagamentoBoleto from 'App/Services/Fluxo/Confimacao/Pagamento/ConfirmacaoPagamentoBoleto';

@inject()
export default class WebhookController {
  constructor(
    private confirmacaoPagamentoPix: ConfirmacaoPagamentoPix,
    private confirmacaoPagamentoBoleto: ConfirmacaoPagamentoBoleto,
    private confirmacaoPagamentoCartaoCredito: ConfirmacaoPagamentoCartaoCredito
  ) {} 

  async index({ request }: HttpContextContract) {
    const params = await request.validate(WebhookBoletoValidator)
    let response = ""

    await Database.transaction(async (transaction) => {
        try {
            response = await this.confirmacaoPagamentoBoleto.confirmarPagamento(params, transaction)

            transaction.commit();
        } catch (error) {
            transaction.rollback();
            throw error;
        }
        })

    return response
  }

  async creditCardPayment({ request }: HttpContextContract) {
    const params = await request.validate(WebhookCartaoCreditoValidator)
    let response = ""

    await Database.transaction(async (transaction) => {
      try {
          response = await this.confirmacaoPagamentoCartaoCredito.confirmarPagamento(params, transaction)

          transaction.commit();
      } catch (error) {
          transaction.rollback();
          throw error;
      }
      })

    return response
  }

  async pixPayment({ request }: HttpContextContract) {
    const params = await request.validate(WebhookPixValidator)
    let response = ""

    await Database.transaction(async (transaction) => {
      try {
        response = await this.confirmacaoPagamentoPix.confirmarPagamento(params, transaction)
        
        transaction.commit();
      } catch (error) {
        transaction.rollback();
        throw error;
      }
    })

    return response;
  }

}
