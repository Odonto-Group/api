import RetornoGeracaoPagamentoIndividual from "App/interfaces/RetornoGeracaoPagamentoIndividual.interface";
import FluxoPagamentoStrategy from "./FluxoPagamentoStrategy";
import { inject } from '@adonisjs/core/build/standalone';
import PagamentoDebitoService from "App/Services/PagamentoDebitoService";
import TbAssociado from "App/Models/TbAssociado";
import TbResponsavelFinanceiro from "App/Models/TbResponsavelFinanceiro";
import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { FormaPagamento } from "App/Enums/FormaPagamento";
import { DateTime } from "luxon";
import { MailSenderService } from "App/Services/MailSenderService";
import AssociadoService from "App/Services/AssociadoService";
import formatNumberBrValue from "App/utils/FormatNumber";
import Env from '@ioc:Adonis/Core/Env'
import FluxoPagamentoBoletoIndividual from "./FluxoPagamentoBoletoIndividual";
import AdesaoEmailContent from "App/interfaces/AdesaoEmailContent.interface";

@inject()
export default class FluxoPagamentoDebitoIndividual implements FluxoPagamentoStrategy {

    private emailDefault = Env.get('EMAIL_ENVIO_DEFAULT')

    constructor(
        private pagamentoDebitoService: PagamentoDebitoService,
        private mailSenderService: MailSenderService,
        private associadoService: AssociadoService,
        private fluxoPagamentoBoleto: FluxoPagamentoBoletoIndividual
    ) {}

    async iniciarFluxoPagamento({associado, responsavelFinanceiro, dataPrimeiroVencimento, transaction, nomePlano, params}: {associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro, transaction: TransactionClientContract, dataPrimeiroVencimento: DateTime, nomePlano: string, params: any}): Promise<RetornoGeracaoPagamentoIndividual> {
        await this.pagamentoDebitoService.removePagamentoDebitoByIdAssociado(associado, transaction);

        await this.pagamentoDebitoService.savePagamentoDebito(params, associado, dataPrimeiroVencimento, transaction)

        let returnPayment = {} as RetornoGeracaoPagamentoIndividual

        if (params.primeiraBoleto) { // DEBITO COM PRIMEIRA NO BOLETO
            returnPayment = await this.fluxoPagamentoBoleto.iniciarFluxoPagamento({associado, responsavelFinanceiro, transaction, dataPrimeiroVencimento, nomePlano, formaPagamento: FormaPagamento.PRIMEIRA_NO_BOLETO})
        
            returnPayment.formaPagamento = FormaPagamento.PRIMEIRA_NO_BOLETO
        } else {
            const planoContent = { 
                NOMEPLANO: nomePlano,
                DATAVENCIMENTO: dataPrimeiroVencimento.toFormat('dd/MM/yyyy'),
                NOMECLIENTE: associado.nm_associado,
                VALORPLANO: formatNumberBrValue(associado.nu_vl_mensalidade),
                METODOPAGAMENTO: FormaPagamento.DEBITO_EM_CONTA
            } as AdesaoEmailContent;
            
            await this.mailSenderService.sendEmailAdesaoSemLinkPagamento(this.emailDefault || responsavelFinanceiro.ds_emailRespFin, 'Bem-vindo à OdontoGroup.', planoContent)

            await this.associadoService.ativarPlanoAssociado(associado, transaction, 1);

            returnPayment.formaPagamento = FormaPagamento.DEBITO_EM_CONTA;
            returnPayment.agencia = params.agencia;
            returnPayment.conta = params.conta;
      }

      return returnPayment   
    }

}