import TbAssociado from "App/Models/TbAssociado";
import FluxoPagamentoStrategy from "./FluxoPagamentoStrategy";
import TbResponsavelFinanceiro from "App/Models/TbResponsavelFinanceiro";
import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import PagamentoBoletoOdontoCobService from "App/Services/PagamentoBoletoOdontoCobService";
import UfService from "App/Services/UfService";
import { MailSenderService } from "App/Services/MailSenderService";
import { inject } from '@adonisjs/core/build/standalone';
import RetornoGeracaoPagamentoIndividual from "App/interfaces/RetornoGeracaoPagamentoIndividual.interface";
import { FormaPagamento } from "App/Enums/FormaPagamento";
import { DateTime } from "luxon";
import NaoFoiPossivelCriarPagamento from "App/Exceptions/NaoFoiPossivelEfetuarPagamento";
import P4XService from "App/Services/P4XService";
import Env from '@ioc:Adonis/Core/Env'
import PagamentoPixOdontoCobService from "App/Services/PagamentoPixOdontoCobService";
import formatNumberBrValue from "App/utils/FormatNumber";
import AdesaoEmailContent from "App/interfaces/AdesaoEmailContent.interface";

@inject()
export default class FluxoPagamentoBoletoIndividual implements FluxoPagamentoStrategy {

    private urlP4xLinkPagamento = Env.get('URL_P4X_PAGAMENTO_BOLETO') as string
    private emailDefault = Env.get('EMAIL_ENVIO_DEFAULT')

    constructor(
        private pagamentoBoletoOdontoCobService: PagamentoBoletoOdontoCobService,
        private pagamentoPixOdontoCobService: PagamentoPixOdontoCobService,
        private ufService: UfService,
        private mailSenderService: MailSenderService,
        private p4XService: P4XService
    ){}

    async iniciarFluxoPagamento({associado, responsavelFinanceiro, dataPrimeiroVencimento, transaction, nomePlano, formaPagamento, boletoUnico}: {associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro, dataPrimeiroVencimento: DateTime, transaction: TransactionClientContract, nomePlano: string, formaPagamento: FormaPagamento, boletoUnico: number}): Promise<RetornoGeracaoPagamentoIndividual> {
        let tipoPessoa = {} as TipoPessoaBoletoIndividual
        
        tipoPessoa = await this.criaBodyPessoaFisica(associado, responsavelFinanceiro, dataPrimeiroVencimento);

        const pagamento = await this.p4XService.geraPagamentoP4XBoleto(tipoPessoa.bodyPagamento)

        const retorno = {} as RetornoGeracaoPagamentoIndividual

        if (pagamento) {
            
            const linkPagamento = this.urlP4xLinkPagamento.replace('idPagamento', pagamento.id)

            await this.pagamentoBoletoOdontoCobService.blAtivoFalseByCliente(associado.id_associado.toString())

            await this.pagamentoBoletoOdontoCobService.removeByClient(tipoPessoa.idAssociado, transaction);

            await this.pagamentoBoletoOdontoCobService.savePagamento(tipoPessoa.idAssociado, pagamento, dataPrimeiroVencimento, linkPagamento, "PF", tipoPessoa.numeroProsposta, boletoUnico, transaction);

            await this.pagamentoPixOdontoCobService.removePagamentoIndividualPix(tipoPessoa.idAssociado, transaction);

            await this.pagamentoPixOdontoCobService.savePagamentoIndividual(tipoPessoa.idAssociado, associado.nu_vl_mensalidade, pagamento, dataPrimeiroVencimento, transaction);
            
            const planoContent = { 
                NOMEPLANO: nomePlano,
                DATAVENCIMENTO: dataPrimeiroVencimento.toFormat('dd/MM/yyyy'),
                NOMECLIENTE: associado.nm_associado,    
                LINKPAGAMENTO: linkPagamento,
                VALORPLANO: formatNumberBrValue(associado.nu_vl_mensalidade),
                METODOPAGAMENTO: formaPagamento
            } as AdesaoEmailContent;
    
            await this.mailSenderService.sendEmailAdesaoBoleto(this.emailDefault || responsavelFinanceiro.ds_emailRespFin, 'Bem-vindo à OdontoGroup.', planoContent)
            
            const pix = {
                copiaCola: pagamento.pix.copiaCola,
                qrCode: pagamento.pix.base64
            } as Pix

            retorno.pix = pix
            retorno.linkPagamento = linkPagamento;
            retorno.formaPagamento = formaPagamento
        } else {
            throw new NaoFoiPossivelCriarPagamento()
        }

        return retorno
    }

    async criaBodyPessoaFisica(associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro, dataPrimeiroVencimento: DateTime): Promise<TipoPessoaBoletoIndividual> {
        const uf = await this.ufService.findUfById(associado.id_UF_a)

        const nome = responsavelFinanceiro.nm_RespFinanc.split(' ')

        const nossoNumero = `2${Math.floor(Math.random() * 900000) + 100000}${associado.id_associado}0`;

        const body = {
            pagadorDocumentoTipo: 1,
            pagadorDocumentoNumero: responsavelFinanceiro.nu_CPFRespFin,
            pagadorNome: nome[0] + nome[nome.length - 1],
            pagadorEndereco: 'XXX',
            pagadorBairro: 'XXX',
            pagadorCidade: 'XXX',
            pagadorUf: uf.sigla,
            pagadorCep: responsavelFinanceiro.nu_CEP,
            dataVencimento: dataPrimeiroVencimento.toString(),
            valorNominal: associado.nu_vl_mensalidade,
            multaPercentual: 0,
            multaQuantidadeDias: 0,
            jurosPercentual: 0,
            tipoDesconto: 0,
            descontoValor: 0,
            descontoDataLimite: dataPrimeiroVencimento.toString(),
            valorAbatimento: 0,
            tipoProtesto: 0,
            protestoQuantidadeDias: 0,
            baixaQuantidadeDias: 0,
            mensagem: 'Não receber após o pagamento.',
            tipoTitulo: 4,
            seuNumero: associado.id_associado,
            pagadorEmail: responsavelFinanceiro.ds_emailRespFin,
            emailEnvio: false,
            emailAssunto: 'BOLETO ODONTOGROUP',
            emailConteudo: 'BOLETO ODONTOGROUP',
            pagadorCelular: responsavelFinanceiro.nu_dddRespFin.toString(),
            smsEnvio: false,
            nossoNumero: nossoNumero,
            convenioId: 'ecf1e024-e1a5-4efa-8399-a081a13bf3d8',
            incluirPix: true,

            };

        let tipoPessoa = {} as TipoPessoaBoletoIndividual
    
        tipoPessoa.idAssociado = associado.id_associado;
        tipoPessoa.numeroProsposta = associado.nr_proposta
        tipoPessoa.primeiroNome = associado.nm_associado.split(' ')[0]
        tipoPessoa.email = associado.ds_email    
        tipoPessoa.bodyPagamento = body;

        return tipoPessoa
    }

}