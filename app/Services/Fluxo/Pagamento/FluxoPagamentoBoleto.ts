import TbAssociado from "App/Models/TbAssociado";
import FluxoPagamentoStrategy from "./FluxoPagamentoStrategy";
import TbResponsavelFinanceiro from "App/Models/TbResponsavelFinanceiro";
import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import PagamentoBoletoOdontoCobService from "App/Services/PagamentoBoletoOdontoCobService";
import UfService from "App/Services/UfService";
import EmpresaService from "App/Services/EmpresaService";
import { MailSenderService } from "App/Services/MailSenderService";
import { inject } from '@adonisjs/core/build/standalone';
import DocumentoPessoaInvalido from "App/Exceptions/DocumentoPessoaInvalido";
import RetornoGeracaoPagamento from "App/interfaces/RetornoGeracaoPagamento.interface";
import { FormaPagamento } from "App/Enums/FormaPagamento";
import { DateTime } from "luxon";
import NaoFoiPossivelCriarPagamento from "App/Exceptions/NaoFoiPossivelEfetuarPagamento";
import P4XService from "App/Services/P4XService";
import Env from '@ioc:Adonis/Core/Env'
import PagamentoPixOdontoCobService from "App/Services/PagamentoPixOdontoCobService";

@inject()
export default class FluxoPagamentoBoleto implements FluxoPagamentoStrategy {

    private urlBaseP4x = Env.get('URL_BASE_P4X')

    constructor(
        private pagamentoBoletoOdontoCobService: PagamentoBoletoOdontoCobService,
        private pagamentoPixOdontoCobService: PagamentoPixOdontoCobService,
        private ufService: UfService,
        private empresaService: EmpresaService,
        private mailSenderService: MailSenderService,
        private p4XService: P4XService,
    ){}

    async iniciarFluxoPagamento({associado, responsavelFinanceiro, dataPrimeiroVencimento, valorContrato, transaction, nomePlano}: {associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro, dataPrimeiroVencimento: string, valorContrato: number, transaction: TransactionClientContract, nomePlano: string}): Promise<RetornoGeracaoPagamento> {
        let tipoPessoa = {} as TipoPessoaBoleto

        if (associado.nu_cpf.length == 11) {
            tipoPessoa = await this.criaBodyPessoaFisica(associado, responsavelFinanceiro, dataPrimeiroVencimento, valorContrato);
        } else if (associado.nu_cpf.length == 14) {
            tipoPessoa = await this.criaBodyPessoaJuridica(associado.nu_cpf, dataPrimeiroVencimento, valorContrato);
        } else {
            throw new DocumentoPessoaInvalido();
        }

        const pagamento = await this.p4XService.geraPagamentoP4XBoleto(tipoPessoa.bodyPagamento)

        const retorno = {} as RetornoGeracaoPagamento

        if (pagamento) {
            
            const linkPagamento = `https://p4x.srv.br/api/v1.0/boletos/${pagamento.id}/imprimir`

            await this.pagamentoBoletoOdontoCobService.removeByClient(tipoPessoa.idClient, transaction);

            await this.pagamentoBoletoOdontoCobService.savePagamento(tipoPessoa.idClient, pagamento, dataPrimeiroVencimento, this.urlBaseP4x, tipoPessoa.tipoPessoa, tipoPessoa.numeroProsposta, transaction);

            await this.pagamentoPixOdontoCobService.savePagamento(tipoPessoa.idClient, pagamento.pix.id, transaction);
            
            const planoContent = { 
                NOMEPLANO: nomePlano,
                DATAVENCIMENTO: DateTime.fromISO(dataPrimeiroVencimento).toFormat('dd/MM/yyyy'),
                NOMECLIENTE: associado.nm_associado,
                LINKPAGAMENTO: linkPagamento
            } as AdesaoEmailContent;
    
            await this.mailSenderService.sendEmailAdesao("gui.henmelo@gmail.com", 'Bem-vindo à OdontoGroup.', planoContent)
    
            retorno.linkPagamento = linkPagamento;
            retorno.formaPagamento = FormaPagamento.BOLETO
            
            const pix = {
                copiaCola: pagamento.pix.copiaCola,
                qrCode: pagamento.pix.base64
            } as Pix

            retorno.pix = pix
        } else {
            throw new NaoFoiPossivelCriarPagamento()
        }

        return retorno
    }

    async criaBodyPessoaJuridica(associadoCpf: string,dataPrimeiroVencimento: string, valorContrato: number): Promise<TipoPessoaBoleto> {
        const empresa = await this.empresaService.buscarEmpresa(associadoCpf)

        await this.pagamentoBoletoOdontoCobService.blAtivoFalseByCliente(empresa.nu_cnpj)

        const uf = await this.ufService.findUfById(empresa.id_UF_e)

        const nome = empresa.nm_responsavel.split(' ')

        const nossoNumero = `2${Math.floor(Math.random() * 900000) + 100000}${empresa.id_cdempresa}0`;

        const bodyPagamento = {
            pagadorDocumentoTipo: 1,
            pagadorDocumentoNumero: empresa.nu_cpf_resp,
            pagadorNome: nome[0] + nome[nome.length - 1],
            pagadorEndereco: 'XXX',
            pagadorBairro: 'XXX',
            pagadorCidade: 'XXX',
            pagadorUf: uf.sigla,
            pagadorCep: empresa.nu_CEP,
            dataVencimento: dataPrimeiroVencimento,
            valorNominal: valorContrato,
            multaPercentual: 0,
            multaQuantidadeDias: 0,
            jurosPercentual: 0,
            tipoDesconto: 0,
            descontoValor: 0,
            descontoDataLimite: dataPrimeiroVencimento,
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
          
        let tipoPessoa = {} as TipoPessoaBoleto
        
        tipoPessoa.idClient = empresa.id_cdempresa
        tipoPessoa.numeroProsposta = empresa.nr_proposta
        tipoPessoa.tipoPessoa = 'PJ'
        tipoPessoa.primeiroNome = empresa.nm_responsavel.split(' ')[0]
        tipoPessoa.email = 'carlos.a.queiroz@gmail.com';
        tipoPessoa.bodyPagamento = bodyPagamento

        return tipoPessoa;
    }

    async criaBodyPessoaFisica(associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro, dataPrimeiroVencimento: string, valorContrato: number): Promise<TipoPessoaBoleto> {
        await this.pagamentoBoletoOdontoCobService.blAtivoFalseByCliente(associado.id_associado.toString())

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
            dataVencimento: dataPrimeiroVencimento,
            valorNominal: valorContrato,
            multaPercentual: 0,
            multaQuantidadeDias: 0,
            jurosPercentual: 0,
            tipoDesconto: 0,
            descontoValor: 0,
            descontoDataLimite: dataPrimeiroVencimento,
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

        let tipoPessoa = {} as TipoPessoaBoleto
    
        tipoPessoa.tipoPessoa = 'PF'
        tipoPessoa.idClient = associado.id_associado;
        tipoPessoa.numeroProsposta = associado.nr_proposta
        tipoPessoa.primeiroNome = associado.nm_associado.split(' ')[0]
        tipoPessoa.email = associado.ds_email    
        tipoPessoa.bodyPagamento = body;

        return tipoPessoa
    }

}