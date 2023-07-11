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

@inject()
export default class ConfirmacaoPagamentoPix implements FluxoConfirmacaoPagamentoStrategy {

    private emailSuporteOdontoGroup = Env.get('EMAIL_ODONTO_GROUP_SUPORTE')
    private emailDefaultTeste = Env.get('EMAIL_ENVIO_DEFAULT')

    constructor(
        private pagamentoPixService: PagamentoPixService,
        private associadoService: AssociadoService,
        private pagamentoPixOdontoCobService: PagamentoPixOdontoCobService,
        private mailSenderService: MailSenderService,
        private smsService: SmsService
      ) {} 

    async confirmarPagamento(params: any, transaction: TransactionClientContract): Promise<string> {
        const associado = await this.associadoService.findAssociadoByCpf(params.pagadorCpfCnpj);

        if (associado && associado.cd_status === 0) {
          const pix = await this.pagamentoPixOdontoCobService.savePagamentoEfetuadoOdontoCob(associado, params, transaction);

          await this.associadoService.updateAssociadoPagamentoEfetuado(associado, transaction)

          await this.pagamentoPixService.savePagamentoEfetuado(associado, params, pix, transaction);

          const responsavelFinanceiro = associado.responsavelFinanceiro[0];

          await this.enviarEmailPagamento(associado, responsavelFinanceiro);

          this.smsService.enviaSmsResponsavelPagamentoEfetuado(responsavelFinanceiro, associado)

          transaction.commit();

          return "Pagamento Pix registrado com sucesso." 
        } else {
          const planoContent = {
            NOMECLIENTE: associado.nm_associado,
            TIPO_PAGAMENTO: FormaPagamento.PIX
          } as ErroEmailContent;

          // todo email com mais dados.

          await this.mailSenderService.sendEmailErro(this.emailDefaultTeste || this.emailSuporteOdontoGroup, 'Erro pagamento OdontoGroup.', planoContent)
        
          return "Nao foi possível registrar o pagamentos por Pix." 
        }
    }

    async enviarEmailPagamento(associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro) {
        const planoContent = {
          NOMECLIENTE: associado.nm_associado
        } as PagamentoEmailContent;
    
        await this.mailSenderService.sendEmailPagamentoAprovado(this.emailDefaultTeste || responsavelFinanceiro.ds_emailRespFin, 'Bem-vindo à OdontoGroup.', associado.id_prodcomerc_a, planoContent);
      }

}