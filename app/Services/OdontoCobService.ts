import DocumentoPessoaInvalido from 'App/Exceptions/DocumentoPessoaInvalido';
import TbAssociado from 'App/Models/TbAssociado';
import TbPagamentoBoletoOdontoCob from 'App/Models/TbPagamentoBoletoOdontoCob';
import PagamentoBoletoOdontoCobService from './PagamentoBoletoOdontoCobService';
import ResponsavelFinanceiroService from './ResponsavelFinanceiroService';
import UfService from './UfService';
import { default as axios } from 'axios';
import EmpresaService from './EmpresaService';
import { inject } from '@adonisjs/core/build/standalone';
import Env from '@ioc:Adonis/Core/Env'
import TbEmpresa from 'App/Models/TbEmpresa';
import Mail from '@ioc:Adonis/Addons/Mail';

@inject()
export default class OdontoCobService {
    private usuario = Env.get('USUARIO_P4X')
    private senha = Env.get('SENHA_P4X')
    private urlBase = Env.get('URL_BASE_P4X')
    
    constructor(
        private pagamentoBoletoOdontoCobService: PagamentoBoletoOdontoCobService,
        private responsavelFinanceiroService: ResponsavelFinanceiroService,
        private ufService: UfService,
        private empresaService: EmpresaService
    ){}

    async gerarBoleto(associado: TbAssociado, dataPrimeiroVencimento: string, valorMensalidade: number) {
        let url = 'v1/boletos'

        let tipoPessoa;
        let resquestBody;
        let idClient;
        let numeroProsposta;
        let primeiroNome;
        let email;
        if (associado.nu_cpf.length == 11) {
            tipoPessoa = 'PF'
            idClient = associado.id_associado;
            numeroProsposta = associado.nr_proposta
            primeiroNome = associado.nm_associado.split(' ')[0]
            email = associado.ds_email
            resquestBody = await this.criaBodyPessoaFisica(associado, dataPrimeiroVencimento, valorMensalidade);
        } else if (associado.nu_cpf.length == 14) {
            const empresa = await this.empresaService.buscarEmpresa(associado.nu_cpf)
            idClient = empresa.id_cdempresa
            numeroProsposta = empresa.nr_proposta
            tipoPessoa = 'PJ'
            primeiroNome = empresa.nm_responsavel.split(' ')[0]
            email = 'carlos.a.queiroz@gmail.com';
            resquestBody = this.criaBodyPessoaJuridica(empresa, dataPrimeiroVencimento, valorMensalidade);
        } else {
            throw new DocumentoPessoaInvalido();
        }

        const geraOc = await this.rodaOdontoCob(url, resquestBody)

        if (geraOc) {
            this.pagamentoBoletoOdontoCobService.removeByClient(idClient);

            await this.pagamentoBoletoOdontoCobService.savePagamento(idClient, geraOc, dataPrimeiroVencimento, this.urlBase, tipoPessoa, numeroProsposta);
        }

        const local = Env.get('app.env');
        if (local !== 'local') {
            // await Mail.send(
            //     'emails.sendSell',
            //     { idClient, tipoPessoa, primeiroNome, geraOc, dataPrimeiroVencimento, tipo: 'boleto', telemedicina: false },
            //     (message) => {
            //     message
            //         .to(email)
            //         .bcc('suporte@odontogroup.com.br')
            //         .subject('Assunto do Email');
            // }
            // );
        }

        const retorno = {} as any
        
        retorno.linkPagamento = this.urlBase + 'v1.0/boletos/$geraOC->id/imprimir';
        retorno.formaPagamento = 'Boleto'

        return retorno
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
            convenioId: 'ecf1e024-e1a5-4efa-8399-a081a13bf3d8'
          };
    }

    async criaBodyPessoaFisica(associado: TbAssociado, dataPrimeiroVencimento: string, valorMensalidade: number): Promise<BodyBoleto> {
        await this.pagamentoBoletoOdontoCobService.blAtivoFalseByCliente(associado.id_associado.toString())
        const responsavelFinanceiro = await this.responsavelFinanceiroService.buscarResponsavelFinanceiroPorIdAssociado(associado.id_associado)
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
            convenioId: 'ecf1e024-e1a5-4efa-8399-a081a13bf3d8'
            };
    }

    async rodaOdontoCob(url: string, body: BodyBoleto) {
        try {
            const response = await axios.post(`https://p4x.srv.br/api/${url}`, body, {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await this.geraToken()}`,
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
            const response = await axios.post(`${this.urlBase}v1/conta/token`, body, {
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