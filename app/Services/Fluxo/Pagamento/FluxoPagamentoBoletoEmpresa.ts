import FluxoPagamentoStrategy from "./FluxoPagamentoStrategy";
import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import PagamentoBoletoOdontoCobService from "App/Services/PagamentoBoletoOdontoCobService";
import UfService from "App/Services/UfService";
import EmpresaService from "App/Services/EmpresaService";
import { MailSenderService } from "App/Services/MailSenderService";
import { inject } from '@adonisjs/core/build/standalone';
import { FormaPagamento } from "App/Enums/FormaPagamento";
import { DateTime } from "luxon";
import NaoFoiPossivelCriarPagamento from "App/Exceptions/NaoFoiPossivelEfetuarPagamento";
import P4XService from "App/Services/P4XService";
import Env from '@ioc:Adonis/Core/Env'
import PagamentoPixOdontoCobService from "App/Services/PagamentoPixOdontoCobService";
import formatNumberBrValue from "App/utils/FormatNumber";
import AdesaoEmailContent from "App/interfaces/AdesaoEmailContent.interface";
import TbEmpresa from "App/Models/TbEmpresa";
import RetornoGeracaoPagamentoEmpresa from "App/interfaces/RetornoGeracaoPagamentoEmpresa.interface";

@inject()
export default class FluxoPagamentoBoletoEmpresa implements FluxoPagamentoStrategy {

    private urlP4xLinkPagamento = Env.get('URL_P4X_PAGAMENTO_BOLETO') as string
    private emailDefault = Env.get('EMAIL_ENVIO_DEFAULT')

    constructor(
        private pagamentoBoletoOdontoCobService: PagamentoBoletoOdontoCobService,
        private pagamentoPixOdontoCobService: PagamentoPixOdontoCobService,
        private ufService: UfService,
        private empresaService: EmpresaService,
        private mailSenderService: MailSenderService,
        private p4XService: P4XService
    ){}

    async iniciarFluxoPagamento({empresa, dataPrimeiroVencimento, transaction, nomePlano, formaPagamento}: {empresa: TbEmpresa, dataPrimeiroVencimento: DateTime, transaction: TransactionClientContract, nomePlano: string, formaPagamento: FormaPagamento}): Promise<RetornoGeracaoPagamentoEmpresa> {
        let tipoPessoa = {} as TipoPessoaBoletoEmpresa

        tipoPessoa = await this.criaBodyPessoaJuridica(empresa, dataPrimeiroVencimento, empresa.nu_vl_mensalidade);

        const pagamento = await this.p4XService.geraPagamentoP4XBoleto(tipoPessoa.bodyPagamento)

        const retorno = {} as RetornoGeracaoPagamentoEmpresa

        if (pagamento) {
            
            const linkPagamento = this.urlP4xLinkPagamento.replace('idPagamento', pagamento.id)

            await this.pagamentoBoletoOdontoCobService.blAtivoFalseByCliente(empresa.nu_cnpj)

            await this.pagamentoBoletoOdontoCobService.removeByClient(tipoPessoa.idEmpresa, transaction);

            await this.pagamentoBoletoOdontoCobService.savePagamento(tipoPessoa.idEmpresa, pagamento, dataPrimeiroVencimento, linkPagamento, "PJ", tipoPessoa.numeroProsposta, 0, transaction);

            await this.pagamentoPixOdontoCobService.removePagamentoEmpresaPix(tipoPessoa.idEmpresa, transaction);

            await this.pagamentoPixOdontoCobService.savePagamentoEmpresa(tipoPessoa.idEmpresa, empresa.nu_vl_mensalidade, pagamento, dataPrimeiroVencimento, transaction);
            
            const planoContent = { 
                NOMEPLANO: nomePlano,
                DATAVENCIMENTO: dataPrimeiroVencimento.toFormat('dd/MM/yyyy'),
                NOMECLIENTE: empresa.nm_nome_fantasia,    
                LINKPAGAMENTO: linkPagamento,
                VALORPLANO: formatNumberBrValue(empresa.nu_vl_mensalidade),
                METODOPAGAMENTO: formaPagamento
            } as AdesaoEmailContent;
    
            await this.mailSenderService.sendEmailAdesaoBoleto(this.emailDefault || empresa.ds_email, 'Bem-vindo à OdontoGroup.', planoContent)
            
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

    async criaBodyPessoaJuridica(empresa: TbEmpresa, dataPrimeiroVencimento: DateTime, valorContrato: number): Promise<TipoPessoaBoletoEmpresa> {
        const uf = await this.ufService.findUfById(empresa.id_UF_e)

        const nossoNumero = `2${Math.floor(Math.random() * 900000) + 100000}${empresa.id_cdempresa}0`;

        const bodyPagamento = {
            pagadorDocumentoTipo: 2,
            pagadorDocumentoNumero: empresa.nu_cpf_resp,
            pagadorNome: empresa.nm_responsavel,
            pagadorEndereco: empresa.tx_EndLograd || 'XXX',
            pagadorBairro: empresa.tx_EndBairro || 'XXX',
            pagadorCidade: empresa.tx_EndCidade || 'XXX',
            pagadorUf: uf.sigla,
            pagadorCep: empresa.nu_CEP,
            dataVencimento: dataPrimeiroVencimento.toString(),
            valorNominal: valorContrato,
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
            seuNumero: empresa.id_cdempresa,
            pagadorEmail: empresa.ds_email,
            emailEnvio: false,
            emailAssunto: 'BOLETO ODONTOGROUP',
            emailConteudo: 'BOLETO ODONTOGROUP',
            pagadorCelular: `${empresa.nu_dddcel ?? '00'}${empresa.nu_celular ?? '000000000'}`,
            smsEnvio: false,
            nossoNumero: nossoNumero,
            convenioId: 'ecf1e024-e1a5-4efa-8399-a081a13bf3d8',
            incluirPix: true,
          } as BodyBoleto;
          
        let tipoPessoa = {} as TipoPessoaBoletoEmpresa
        
        tipoPessoa.idEmpresa = empresa.id_cdempresa
        tipoPessoa.numeroProsposta = empresa.nr_proposta
        tipoPessoa.primeiroNome = empresa.nm_responsavel.split(' ')[0]
        tipoPessoa.email = 'suporte@odontogroup.com.br';
        tipoPessoa.bodyPagamento = bodyPagamento

        return tipoPessoa;
    }
}