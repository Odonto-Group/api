import DocumentoPessoaInvalido from 'App/Exceptions/DocumentoPessoaInvalido';
import TbAssociado from 'App/Models/TbAssociado';
import PagamentoBoletoOdontoCobService from './PagamentoBoletoOdontoCobService';
import ResponsavelFinanceiroService from './ResponsavelFinanceiroService';
import UfService from './UfService';
import { default as axios } from 'axios';
import EmpresaService from './EmpresaService';
import { inject } from '@adonisjs/core/build/standalone';
import Env from '@ioc:Adonis/Core/Env'
import TbEmpresa from 'App/Models/TbEmpresa';
import { DateTime } from 'luxon';
import AssociadoService from './AssociadoService';
import PagamentoCartaoOdontoCobService from './PagamentoCartaoOdontoCobService';
import { MailSenderService } from './MailSenderService';
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database';
import TbResponsavelFinanceiro from 'App/Models/TbResponsavelFinanceiro';
import NaoFoiPossivelCriarPagamento from 'App/Exceptions/NaoFoiPossivelEfetuarPagamento';
import RetornoGeracaoPagamento from 'App/interfaces/RetornoGeracaoPagamento.interface';
import { FormaPagamento } from 'App/Enums/FormaPagamento';

@inject()
export default class OdontoCobService {
    private usuario = Env.get('USUARIO_P4X')
    private senha = Env.get('SENHA_P4X')
    private urlBase = Env.get('URL_BASE_P4X')
    
    constructor(
        private pagamentoBoletoOdontoCobService: PagamentoBoletoOdontoCobService,
        private ufService: UfService,
        private empresaService: EmpresaService,
        private pagamentoCartaoOdontoCobService: PagamentoCartaoOdontoCobService,
        private mailSenderService: MailSenderService
    ){}

    async gerarBoleto(associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro, dataPrimeiroVencimento: string, valorMensalidade: number, transaction: TransactionClientContract, nomePlano: string): Promise<RetornoGeracaoPagamento> {
        let url = 'api/v1/boletos'

        let tipoPessoa = {} as TipoPessoaBoleto
        if (associado.nu_cpf.length == 11) {
            tipoPessoa.tipoPessoa = 'PF'
            tipoPessoa.idClient = associado.id_associado;
            tipoPessoa.numeroProsposta = associado.nr_proposta
            tipoPessoa.primeiroNome = associado.nm_associado.split(' ')[0]
            tipoPessoa.email = associado.ds_email
            tipoPessoa.bodyPagamento = await this.criaBodyPessoaFisica(associado, responsavelFinanceiro, dataPrimeiroVencimento, valorMensalidade);
        } else if (associado.nu_cpf.length == 14) {
            const empresa = await this.empresaService.buscarEmpresa(associado.nu_cpf)
            tipoPessoa.idClient = empresa.id_cdempresa
            tipoPessoa.numeroProsposta = empresa.nr_proposta
            tipoPessoa.tipoPessoa = 'PJ'
            tipoPessoa.primeiroNome = empresa.nm_responsavel.split(' ')[0]
            tipoPessoa.email = 'carlos.a.queiroz@gmail.com';
            tipoPessoa.bodyPagamento = await this.criaBodyPessoaJuridica(empresa, dataPrimeiroVencimento, valorMensalidade);
        } else {
            throw new DocumentoPessoaInvalido();
        }

        
        const pagamento = await this.rodaOdontoCob(url, tipoPessoa.bodyPagamento)

        const retorno = {} as RetornoGeracaoPagamento
        if (pagamento) {
            
            const linkPagamento = `https://p4x.srv.br/api/v1.0/boletos/${pagamento.id}/imprimir`

            this.pagamentoBoletoOdontoCobService.removeByClient(tipoPessoa.idClient, transaction);

            await this.pagamentoBoletoOdontoCobService.savePagamento(tipoPessoa.idClient, pagamento, dataPrimeiroVencimento, this.urlBase, tipoPessoa.tipoPessoa, tipoPessoa.numeroProsposta, transaction);
        
            const planoContent = { 
                "nome-plano": nomePlano,
                "data-vencimento": DateTime.fromISO(dataPrimeiroVencimento).toFormat('dd/MM/yyyy'),
                "nome-cliente": associado.nm_associado,
                "link-pagamento": linkPagamento
            };
    
            await this.mailSenderService.sendEmailAdesao("gui.henmelo@gmail.com", 'Bem-vindo à OdontoGroup.', planoContent)
    
            retorno.linkPagamento = linkPagamento;
            retorno.formaPagamento = FormaPagamento.BOLETO
        } else {
            throw new NaoFoiPossivelCriarPagamento()
        }

        return retorno
    }

    async geraCartao(associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro, transaction: TransactionClientContract, dataPrimeiroVencimento: string, nomePlano: string): Promise<RetornoGeracaoPagamento> {
        const uf = await this.ufService.findUfById(associado.id_UF_a);
        const url = '/v1.1/sacadores/pagamentos/token';

        this.pagamentoCartaoOdontoCobService.deletePagamento(associado, transaction);
    
        const dataExpiracao = DateTime.local().plus({ days: 7 }).toFormat('yyyy/mm/dd')

        const body = {
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
                "compradorEnderecoCep" : responsavelFinanceiro.nu_CEP,
                "compradorEnderecoCidade": responsavelFinanceiro.tx_EndCidade,
                "compradorEnderecoEstado": uf.sigla,
                "salvarCartao": true
        }
    
        const retorno = {} as RetornoGeracaoPagamento

        const pagamento = await this.rodaOdontoCob(url, body)

        if (pagamento) {
            const dataD7 = DateTime.local().plus({ days: 7 }).toFormat('yyyy-MM-dd')

            const linkPagamento = `https://p4x.srv.br/pagamentos/?token=${pagamento.id}`
    
            this.pagamentoCartaoOdontoCobService.savePagamento(associado, pagamento, dataD7, linkPagamento, transaction)
    
            const planoContent = { 
            "nome-plano": nomePlano,
            "data-vencimento": DateTime.fromISO(dataPrimeiroVencimento).toFormat('dd/MM/yyyy'),
            "nome-cliente": associado.nm_associado,
            "link-pagamento": linkPagamento
            };
    
            this.mailSenderService.sendEmailAdesao('gui.henmelo@gmail.com', 'Bem-vindo à OdontoGroup.', planoContent)
    
            retorno.formaPagamento = FormaPagamento.CARTAO_CREDITO
            retorno.linkPagamento = linkPagamento
        } else {
            throw new NaoFoiPossivelCriarPagamento()
        }

        return retorno;
    }
    

    async criaBodyPessoaJuridica(empresa: TbEmpresa, dataPrimeiroVencimento: string, valorMensalidade: number): Promise<BodyBoleto> {
        await this.pagamentoBoletoOdontoCobService.blAtivoFalseByCliente(empresa.nu_cnpj)
        const uf = await this.ufService.findUfById(empresa.id_UF_e)

        const nome = empresa.nm_responsavel.split(' ')

        const nossoNumero = `2${Math.floor(Math.random() * 900000) + 100000}${empresa.id_cdempresa}0`;

        return {
            pagadorDocumentoTipo: 1,
            pagadorDocumentoNumero: empresa.nu_cpf_resp,
            pagadorNome: nome[0] + nome[nome.length - 1],
            pagadorEndereco: 'XXX',
            pagadorBairro: 'XXX',
            pagadorCidade: 'XXX',
            pagadorUf: uf.sigla,
            pagadorCep: empresa.nu_CEP,
            dataVencimento: dataPrimeiroVencimento,
            valorNominal: valorMensalidade,
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
          };
    }

    async criaBodyPessoaFisica(associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro, dataPrimeiroVencimento: string, valorMensalidade: number): Promise<BodyBoleto> {
        await this.pagamentoBoletoOdontoCobService.blAtivoFalseByCliente(associado.id_associado.toString())
        const uf = await this.ufService.findUfById(associado.id_UF_a)

        const nome = responsavelFinanceiro.nm_RespFinanc.split(' ')

        const nossoNumero = `2${Math.floor(Math.random() * 900000) + 100000}${associado.id_associado}0`;

        return {
            pagadorDocumentoTipo: 1,
            pagadorDocumentoNumero: responsavelFinanceiro.nu_CPFRespFin,
            pagadorNome: nome[0] + nome[nome.length - 1],
            pagadorEndereco: 'XXX',
            pagadorBairro: 'XXX',
            pagadorCidade: 'XXX',
            pagadorUf: uf.sigla,
            pagadorCep: responsavelFinanceiro.nu_CEP,
            dataVencimento: dataPrimeiroVencimento,
            valorNominal: valorMensalidade,
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
    }
    

    async rodaOdontoCob(url: string, body: any) {
        try {
            const token = await this.geraToken();

            const response = await axios.post(`${Env.get('URL_BASE_P4X_DEV')}boletos`, body, {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                },
            });
    
            if (response.status === 200) {
                return response.data;
            } else {
                return false;
            }
        } catch (erro) {
            return false
        }
        
    }

    async  geraToken() {
        const body = {
            usuario: this.usuario,
            senha: this.senha
        };

        try {
            const response = await axios.post(`${this.urlBase}sandbox/conta/token`, body, {
            headers: {
                'Content-Type': 'application/json'
            }
            });

            if (response.status === 200) {
                const result = response.data;
                return result.token;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    }

}