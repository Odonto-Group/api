import { inject } from "@adonisjs/core/build/standalone";
import FluxoConfirmacaoPagamentoStrategy from "./ConfirmacaoPagamentoStrategy";
import PagamentoPixService from "App/Services/PagamentoPixService";
import AssociadoService from "App/Services/AssociadoService";
import PagamentoPixOdontoCobService from "App/Services/PagamentoPixOdontoCobService";
import { MailSenderService } from "App/Services/MailSenderService";
import SmsService from "App/Services/SmsService";
import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { FormaPagamento } from "App/Enums/FormaPagamento";
import Env from '@ioc:Adonis/Core/Env'
import ErroEmailContent from "App/interfaces/ErroEmailContent.interface";
import TbAssociado from "App/Models/TbAssociado";
import TbResponsavelFinanceiro from "App/Models/TbResponsavelFinanceiro";
import PagamentoBoletoService from "App/Services/PagamentoBoletoService";
import PagamentoBoletoOdontoCobService from "App/Services/PagamentoBoletoOdontoCobService";


@inject()
export default class ConfirmacaoPagamentoBoleto implements FluxoConfirmacaoPagamentoStrategy {

    private emailSuporteOdontoGroup = Env.get('EMAIL_ODONTO_GROUP_SUPORTE')
    private emailDefaultTeste = Env.get('EMAIL_ENVIO_DEFAULT')

    constructor(
        private associadoService: AssociadoService,
        private mailSenderService: MailSenderService,
        private smsService: SmsService,
        private pagamentoBoletoService: PagamentoBoletoService,
        private pagamentoBoletoOdontoCobService: PagamentoBoletoOdontoCobService
      ) {} 

    async confirmarPagamento(params: any, transaction: TransactionClientContract): Promise<string> {
        const associado = await this.associadoService.findAssociadoByNossoNumeroBoleto(params.nossoNumero);

        if (associado.cd_status && associado.cd_status != 0  && associado.cd_status != 2) {

            const pagamentoOdontoCob = await this.pagamentoBoletoOdontoCobService.savePagamentoEfetuadoOdontoCob(associado, params, transaction);

            await this.associadoService.updateAssociadoPagamentoEfetuado(associado)

            await this.pagamentoBoletoService.savePagamentoEfetuado(associado, params, pagamentoOdontoCob, transaction);

            const responsavelFinanceiro = associado.responsavelFinanceiro[0];

            await this.enviarEmailPagamento(associado, responsavelFinanceiro);

            this.smsService.enviaSmsResponsavelPagamentoEfetuado(responsavelFinanceiro, associado)

            transaction.commit();

            return "Pagamento por Boleto registrado com sucesso." 
        } else {
            const planoContent = {
                NOMECLIENTE: associado.nm_associado,
                TIPO_PAGAMENTO: FormaPagamento.BOLETO
            } as ErroEmailContent;
    
            await this.mailSenderService.sendEmailErro(this.emailDefaultTeste || this.emailSuporteOdontoGroup, 'Erro pagamento OdontoGroup.', planoContent)
        
            return "Nao foi possível registrar o pagamentos por Boleto." 
            }
    }

    async enviarEmailPagamento(associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro) {
        const planoContent = {
          NOMECLIENTE: associado.nm_associado
        } as PagamentoEmailContent;
    
        await this.mailSenderService.sendEmailPagamentoAprovado(this.emailDefaultTeste || responsavelFinanceiro.ds_emailRespFin, 'Bem-vindo à OdontoGroup.', associado.id_prodcomerc_a, planoContent);
      }

}