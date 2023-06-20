import RetornoGeracaoPagamento from "App/interfaces/RetornoGeracaoPagamento.interface";
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
import FluxoPagamentoBoleto from "./FluxoPagamentoBoleto";

@inject()
export default class FluxoPagamentoDebito implements FluxoPagamentoStrategy {

    private emailDefault = Env.get('EMAIL_ENVIO_DEFAULT')

    constructor(
        private pagamentoDebitoService: PagamentoDebitoService,
        private mailSenderService: MailSenderService,
        private associadoService: AssociadoService,
        private fluxoPagamentoBoleto: FluxoPagamentoBoleto
    ) {}

    async iniciarFluxoPagamento({associado, responsavelFinanceiro, dataPrimeiroVencimento, transaction, nomePlano, params}: {associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro, transaction: TransactionClientContract, dataPrimeiroVencimento: string, nomePlano: string, params: any}): Promise<RetornoGeracaoPagamento> {
        await this.pagamentoDebitoService.removePagamentoDebitoByIdAssociado(associado, transaction);

        await this.pagamentoDebitoService.savePagamentoDebito(params, associado, dataPrimeiroVencimento, transaction)

        let returnPayment = {} as RetornoGeracaoPagamento

        if (params.primeiraBoleto) { // DEBITO COM PRIMEIRA NO BOLETO
            returnPayment = await this.fluxoPagamentoBoleto.iniciarFluxoPagamento({associado, responsavelFinanceiro, transaction, dataPrimeiroVencimento, nomePlano})
        
            returnPayment.formaPagamento = FormaPagamento.PRIMEIRA_NO_BOLETO
        } else {
            const planoContent = { 
            NOMEPLANO: nomePlano,
            DATAVENCIMENTO: DateTime.fromISO(dataPrimeiroVencimento).toFormat('dd/MM/yyyy'),
            NOMECLIENTE: associado.nm_associado,
            VALORPLANO: formatNumberBrValue(associado.nu_vl_mensalidade)
            } as AdesaoEmailContent;
            
            await this.mailSenderService.sendEmailAdesaoSemLinkPagamento(this.emailDefault || responsavelFinanceiro.ds_emailRespFin, 'Bem-vindo à OdontoGroup.', associado.id_prodcomerc_a, planoContent)

            await this.associadoService.ativarPlanoAssociado(associado, transaction, 1);

            returnPayment.formaPagamento = FormaPagamento.DEBITO_EM_CONTA;
            returnPayment.agencia = params.agencia;
            returnPayment.conta = params.conta;
      }

      return returnPayment   
    }

}