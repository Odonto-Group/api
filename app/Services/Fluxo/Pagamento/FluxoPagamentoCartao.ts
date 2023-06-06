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

@inject()
export default class FluxoPagamentoCartao implements FluxoPagamentoStrategy {

    constructor(
        private ufService: UfService,
        private p4XService: P4XService,
        private pagamentoCartaoOdontoCobService: PagamentoCartaoOdontoCobService,
        private mailSenderService: MailSenderService
    ){}

    async iniciarFluxoPagamento({associado, responsavelFinanceiro, dataPrimeiroVencimento, transaction, nomePlano}: {associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro, transaction: TransactionClientContract, dataPrimeiroVencimento: string, nomePlano: string}): Promise<RetornoGeracaoPagamento> {
        this.pagamentoCartaoOdontoCobService.deletePagamento(associado, transaction);

        const body = await this.buildBodyRequest(associado, responsavelFinanceiro)
    
        const retorno = {
            formaPagamento: FormaPagamento.CARTAO_CREDITO
        } as RetornoGeracaoPagamento

        const pagamento = await this.p4XService.geraPagamentoP4XCartaoCredito(body)

        if (pagamento) {
            const dataD7 = DateTime.local().plus({ days: 7 }).toFormat('yyyy-MM-dd')

            const linkPagamento = `https://p4x.srv.br/pagamentos/?token=${pagamento.id}`
    
            this.pagamentoCartaoOdontoCobService.savePagamento(associado, pagamento, dataD7, linkPagamento, transaction)
    
            const planoContent = { 
                NOMEPLANO: nomePlano,
                DATAVENCIMENTO: DateTime.fromISO(dataPrimeiroVencimento).toFormat('dd/MM/yyyy'),
                NOMECLIENTE: associado.nm_associado,
                LINKPAGAMENTO: linkPagamento
            } as AdesaoEmailContent;
    
            this.mailSenderService.sendEmailAdesao('gui.henmelo@gmail.com', 'Bem-vindo à OdontoGroup.', planoContent)
    
            retorno.linkPagamento = linkPagamento
        } else {
            throw new NaoFoiPossivelCriarPagamento()
        }

        return retorno;
    }

    private async buildBodyRequest(associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro) {
        const uf = await this.ufService.findUfById(associado.id_UF_a);

        const dataExpiracao = DateTime.local().plus({ days: 7 }).toFormat('yyyy/mm/dd')

        return {
            "dataExpiracao": dataExpiracao,
            "compraId": associado.nr_proposta,
            "compradorId": associado.id_associado,
            "descricao": "ADESÃO PLANO ODONTOLÓGICO - ODONTOGROUP",
            "valor": associado.nu_vl_mensalidade,
            "compradorNomeCompleto": responsavelFinanceiro.nm_RespFinanc,
            "compradorDocumentoTipo": "PF",
            "compradorDocumentoNumero": responsavelFinanceiro.nu_CPFRespFin,
            "compradorEmail": responsavelFinanceiro.ds_emailRespFin,
            "compradorTelefone": responsavelFinanceiro.nu_dddRespFin + responsavelFinanceiro.nu_telRespFin,
            "compradorEnderecoLogradouro": responsavelFinanceiro.tx_EndLograd,
            "compradorEnderecoNumero": responsavelFinanceiro.tx_EndNumero,
            "compradorEnderecoComplemento": responsavelFinanceiro.tx_EndCompl,
            "compradorEnderecoCep": responsavelFinanceiro.nu_CEP,
            "compradorEnderecoCidade": responsavelFinanceiro.tx_EndCidade,
            "compradorEnderecoEstado": uf.sigla,
            "salvarCartao": true
        };
    }

}