import TbAssociado from "App/Models/TbAssociado";
import FluxoPagamentoStrategy from "./FluxoPagamentoStrategy";
import TbResponsavelFinanceiro from "App/Models/TbResponsavelFinanceiro";
import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import UfService from "App/Services/UfService";
import PagamentoCartaoOdontoCobService from "App/Services/PagamentoCartaoOdontoCobService";
import { MailSenderService } from "App/Services/MailSenderService";
import { inject } from '@adonisjs/core/build/standalone';
import RetornoGeracaoPagamento from "App/interfaces/RetornoGeracaoPagamento.interface";
import { FormaPagamento } from "App/Enums/FormaPagamento";
import { DateTime } from "luxon";
import NaoFoiPossivelCriarPagamento from "App/Exceptions/NaoFoiPossivelEfetuarPagamento";
import P4XService from "App/Services/P4XService";
import { TipoTransacao } from "App/Enums/TipoTransacao";
import Env from '@ioc:Adonis/Core/Env'
import { SituacaoRetornoCartao } from "App/Enums/SituacaoRetornoCartao";
import creditCardType from 'credit-card-type';
import AssociadoService from "App/Services/AssociadoService";

@inject()
export default class FluxoPagamentoCartao implements FluxoPagamentoStrategy {

    private emailDefault = Env.get('EMAIL_ENVIO_DEFAULT')
    private urlP4xLinkPagamento = Env.get('URL_P4X_PAGAMENTO_CARTAO') as string
    private bandeiraPadrao = Env.get('BANDEIRA_PADRAO')
    private ambienteLocal = Env.get('NODE_ENV') == 'development'

    constructor(
        private ufService: UfService,
        private p4XService: P4XService,
        private pagamentoCartaoOdontoCobService: PagamentoCartaoOdontoCobService,
        private mailSenderService: MailSenderService,
        private associadoService: AssociadoService
    ){}

    async iniciarFluxoPagamento({associado, responsavelFinanceiro, dataPrimeiroVencimento, transaction, nomePlano, params}: {associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro, transaction: TransactionClientContract, dataPrimeiroVencimento: string, nomePlano: string, params: any}): Promise<RetornoGeracaoPagamento> {
        await this.pagamentoCartaoOdontoCobService.deletePagamento(associado, transaction);

        const body = await this.buildBodyRequest(associado, responsavelFinanceiro, params)
    
        const retorno = {
            formaPagamento: FormaPagamento.CARTAO_CREDITO
        } as RetornoGeracaoPagamento

        const pagamento = await this.p4XService.geraPagamentoP4XCartaoCredito(body)

        if (pagamento) {
            const dataD7 = DateTime.local().plus({ days: 7 }).toFormat('yyyy-MM-dd')

            const linkPagamento = this.urlP4xLinkPagamento.replace('idPagamento', pagamento.pagamentoId)
    
            await this.pagamentoCartaoOdontoCobService.savePagamento(associado, pagamento, dataD7, linkPagamento, transaction)

            if (pagamento.situacao == SituacaoRetornoCartao.APROVADA) {
                await this.associadoService.ativarPlanoAssociado(associado, transaction, 2);

                const planoContent = {
                    NOMECLIENTE: associado.nm_associado
                } as PagamentoEmailContent;

                await this.mailSenderService.sendEmailPagamentoAprovado(this.emailDefault || responsavelFinanceiro.ds_emailRespFin, 'Bem-vindo à OdontoGroup.', planoContent)
            } else if (pagamento.situacao == SituacaoRetornoCartao.NAO_APROVADA) {

                const planoContent = { 
                    NOMEPLANO: nomePlano,
                    DATAVENCIMENTO: DateTime.fromISO(dataPrimeiroVencimento).toFormat('dd/MM/yyyy'),
                    NOMECLIENTE: associado.nm_associado,    
                    LINKPAGAMENTO: linkPagamento,
                    VALORPLANO: associado.nu_vl_mensalidade
                } as AdesaoEmailContent;

                await this.mailSenderService.sendEmailAdesaoCartao(this.emailDefault || responsavelFinanceiro.ds_emailRespFin, 'Bem-vindo à OdontoGroup.', planoContent)
            } else {
                // TODO ERRO SITUACAO DESCONHECIDA
            }
    
            retorno.linkPagamento = linkPagamento
        } else {
            throw new NaoFoiPossivelCriarPagamento()
        }

        return retorno;
    }

    private async buildBodyRequest(associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro, params: any) {
        const uf = await this.ufService.findUfById(associado.id_UF_a);

        const nomeLista = responsavelFinanceiro.nm_RespFinanc.split(" ");

        const expiracaoCartao = params.cartaoCredito.expiracao.split("/");

        const cartaoNumeroFormatado = params.cartaoCredito.numero.replaceAll(" ", "");
        return {
            "id": associado.nr_proposta,
            "valor": associado.nu_vl_mensalidade,
            "comprador": {
              "id": associado.id_associado,
              "documentoNumero": responsavelFinanceiro.nu_CPFRespFin,
              "documentoTipo": "PF",
              "email":  responsavelFinanceiro.ds_emailRespFin,
              "nomeCompleto": responsavelFinanceiro.nm_RespFinanc,
              "primeiroNome": nomeLista[0],
              "ultimoNome": nomeLista[nomeLista.length - 1],
              "enderecoLogradouro": responsavelFinanceiro.tx_EndLograd,
              "enderecoNumero": responsavelFinanceiro.tx_EndNumero,
              "enderecoComplemento": responsavelFinanceiro.tx_EndCompl,
              "enderecoCep": responsavelFinanceiro.nu_CEP,
              "enderecoBairro": responsavelFinanceiro.tx_EndBairro,
              "enderecoCidade": responsavelFinanceiro.tx_EndCidade,
              "enderecoEstado": uf.sigla,
              "telefone": responsavelFinanceiro.nu_telRespFin
            },
            "cartao": {
              "numero": cartaoNumeroFormatado,
              "codigoSeguranca": params.cartaoCredito.codigoSeguranca,
              "nome": params.cartaoCredito.nome, 
              "expiracaoMes": expiracaoCartao[0],
              "expiracaoAno": expiracaoCartao[1],
              "bandeira": this.getBandeiraCartao(cartaoNumeroFormatado),
              "incluirCofre": true
            },
            "tipoTransacao": TipoTransacao.A_VISTA,
            "quantidadeParcelas": 1,
            "convenioId": "ecf1e024-e1a5-4efa-8399-a081a13bf3d8",
            "gerarLinkPagamento": true
          }
    }

    getBandeiraCartao(number) {
        const cardTypes = creditCardType(number);
        
        if (cardTypes && cardTypes.length > 0) {
            return cardTypes[0].type;
        }
    
        return this.ambienteLocal ? this.bandeiraPadrao : 'Unknown';
    }

}