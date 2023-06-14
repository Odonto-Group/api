import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { inject } from '@adonisjs/fold'
import PagamentoCartaoService from 'App/Services/PagamentoCartaoService';
import Database from '@ioc:Adonis/Lucid/Database';
import PagamentoBoletoService from 'App/Services/PagamentoBoletoService';
import AssociadoService from 'App/Services/AssociadoService';
import PagamentoCartaoOdontoCobService from 'App/Services/PagamentoCartaoOdontoCobService';
import { DateTime } from 'luxon';
import PagamentoBoletoOdontoCobService from 'App/Services/PagamentoBoletoOdontoCobService';

@inject()
export default class PlanPayment {

  constructor(
    private pagamentoCartaoService: PagamentoCartaoService,
    private pagamentoBoletoService: PagamentoBoletoService,
    private associadoService: AssociadoService,
    private pagamentoCartaoOdontoCobService: PagamentoCartaoOdontoCobService,
    private pagamentoBoletoOdontoCobService: PagamentoBoletoOdontoCobService

  ) {} 

  async index({ request }: HttpContextContract) {
    // cadastra na tabela boleto
    // atualiza odontocob
    // altera status associado

    const params = request.all()

    await Database.transaction(async (transaction) => {
    try {
        const associado = await this.associadoService.findAssociadoByNossoNumeroBoleto(params.nossoNumero);

        if (associado.cd_status && associado.cd_status != 0  && associado.cd_status != 2) {

            await this.pagamentoBoletoOdontoCobService.savePagamentoEfetuadoOdontoCob(associado, params, transaction);

            await this.associadoService.updateAssociadoPagamentoEfetuado(associado)

            await this.pagamentoBoletoService.savePagamentoEfetuado(associado, params, transaction);

            // TO DO INSERIR CRIACAO DE EMAIL E ENVIO
            // TO DO INSERIR ENVIO DE SMS
        } else {
            // TO DO ENVIAR EMAIL PARA SUPORTE CASO DE ERRO
        }

        await this.pagamentoCartaoService.inserePagamentoEfetuado(params, transaction);

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

            // TO DO INSERIR CRIACAO DE EMAIL E ENVIO
            // TO DO INSERIR ENVIO DE SMS
          } else {
            // TO DO ENVIAR EMAIL PARA SUPORTE CASO DE ERRO
          }

          await this.pagamentoCartaoService.inserePagamentoEfetuado(params, transaction);


          transaction.commit();
        } catch (error) {
          transaction.rollback();
          throw error;
        }
      })
  }

  async pixPayment({ request }: HttpContextContract) {
    //fluxo mesmo do boleto
    
    const params = request.all()

    await Database.transaction(async (transaction) => {
        try {
          

          transaction.commit();
        } catch (error) {
          transaction.rollback();
          throw error;
        }
      })

  }

  
}
