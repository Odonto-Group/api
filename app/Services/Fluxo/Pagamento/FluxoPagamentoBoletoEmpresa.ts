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
import S4EService from "App/Services/S4EService";
import OrgaoService from "App/Services/OrgaoService";
import TokenService from "App/Services/TokenService";
import ProdutoComercialService from "App/Services/ProdutoComercialService";
import EnderecoS4e from "App/interfaces/EnderecoS4e";
import ApiV3Service from "App/Services/ApiV3";
import { format, parse } from "date-fns";
import { PaymentStatus } from "App/Enums/PaymentStatus";
import LogService from "App/Services/Log/Log";


@inject()
export default class FluxoPagamentoBoletoEmpresa implements FluxoPagamentoStrategy {

    private urlP4xLinkPagamento = Env.get('URL_P4X_PAGAMENTO_BOLETO') as string
    private emailDefault = Env.get('EMAIL_ENVIO_DEFAULT')

    constructor(
        private pagamentoBoletoOdontoCobService: PagamentoBoletoOdontoCobService,
        private pagamentoPixOdontoCobService: PagamentoPixOdontoCobService,
        private logService: LogService,
        private ufService: UfService,
        private empresaService: EmpresaService,
        private mailSenderService: MailSenderService,
        private p4XService: P4XService,
        private tokenService: TokenService,
        private produtoService: ProdutoComercialService,
        private S4eService: S4EService,
        private ApiV3Service: ApiV3Service,
        private orgaoService: OrgaoService
    ){}

    async iniciarFluxoPagamento({empresa, dataPrimeiroVencimento, transaction, nomePlano, produtoComercial, formaPagamento, params}: {empresa: TbEmpresa, dataPrimeiroVencimento: DateTime, transaction: TransactionClientContract, nomePlano: string, produtoComercial: any, formaPagamento: FormaPagamento, params: any}): Promise<RetornoGeracaoPagamentoEmpresa> {
        let tipoPessoa = {} as TipoPessoaBoletoEmpresa

        tipoPessoa = await this.criaBodyPessoaJuridica(empresa, dataPrimeiroVencimento, empresa.nu_vl_mensalidade);

        const payment = await this.p4XService.geraPagamentoP4XBoleto(tipoPessoa.bodyPagamento);

        const retorno = {} as RetornoGeracaoPagamentoEmpresa;
        
        if (payment.status) {
            const pagamento = payment.data;
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
            
            //let dataDependente = format(associado.dt_nasc, 'yyyy-MM-dd');
            //let dataRespFinanc = format(responsavelFinanceiro.dt_NascRespFin, 'yyyy-MM-dd');
    
            await this.mailSenderService.sendEmailAdesaoBoleto(this.emailDefault || empresa.ds_email, 'Bem-vindo à OdontoGroup.', planoContent)
            const endereco: EnderecoS4e  = await this.S4eService.getEnderecoByCep(empresa.nu_CEP);
            const TokenV1 = Env.get('S4E_TOKEN_V1');
            const centroCusto = await this.getCentroCusto(endereco.IdUf);
            //console.log('chegou aqui: ', produtoComercial);
            console.log('formas de pagamento: ', produtoComercial.formasPagamentoEmpresa[0].vl_valor);
            const mensalidade = Number(produtoComercial.formasPagamentoEmpresa[0].vl_valor);
            const mesAno = await this.formatarMesAno(empresa.DT_CADASTRO);
            const celular = empresa.nu_dddcel + empresa.nu_celular;
            const telefone = empresa.nu_dddfixo1 + empresa.nu_telfixo1;
            const bodyEmpresa = {
                token: TokenV1,
                empresa: {
                    razaoSocial: empresa.nm_razao_social,
                    nomeFantazia: empresa.nm_nome_fantasia,
                    tipoEmpresa: 2,
                    inclusaoPortal: 2,
                    responsavelLegal: empresa.nm_responsavel,
                    centroCusto: centroCusto,
                    acessoAoPortal: "1",
                    dataContrato: empresa.DT_CADASTRO,
                    matricula: 0,
                    plataforma: 20945,
                    vendedor: "20945",
                    vencimento: 15,//escolha
                    corte: 19, //empresa escolhe
                    anoMesPrimeiroPagamento: mesAno, 
                    empresaOnline: 1,
                    vigencia: 1,
                    carenciaCobertura: 1,
                    carenciaPrimeiroAtendimento: 8, 
                    inicioCobertura: 1, 
                    padraoVendas: 1, 
                    redeAtendimento: 1,
                    formaPagamento: 578,
                    exigeMatricula: 0,
                    cep: empresa.nu_CEP,
                    uf: endereco.IdUf,
                    municipio: endereco.IdMunicipio,
                    bairro: endereco.IdBairro,
                    cnpj: empresa.nu_cnpj,
                    nomeContato: empresa.nm_responsavel,
                    cd_grupo: 67,
                    IdTipoLogradouro: endereco.IdTipoLogradouro,
                    Logradouro: empresa.tx_EndLograd,
                    numero: empresa.tx_EndNumero,
                    complemento: empresa.tx_EndCompl,
                    cpfResponsavel: empresa.nu_cpf_resp,
                    geraCarteira: true,
                    cobrancaCep: empresa.nu_CEP,
                    cobrancaIdTipoLogradouro: endereco.IdTipoLogradouro,
                    cobrancaLogradouro: empresa.tx_EndLograd,
                    cobrancaNumero: empresa.tx_EndNumero,
                    cobrancaComplemento: empresa.tx_EndCompl,
                    cobrancaMunicipio: endereco.IdMunicipio,
                    cobrancaUf: endereco.IdUf,
                    cobrancaBairro: endereco.IdBairro,
                    enderecoBoleto: empresa.tx_EndLograd,
                    faturaCep: empresa.nu_CEP,
                    faturaIdTipoLogradouro: endereco.IdTipoLogradouro,
                    faturaLogradouro: empresa.tx_EndLograd,
                    faturaNumero: empresa.tx_EndNumero,
                    faturaComplemento: empresa.tx_EndCompl,
                    faturaMunicipio: endereco.IdMunicipio,
                    faturaUf: endereco.IdUf,
                    faturaBairro: endereco.IdBairro,
                    vendaSite: 0,
                    contato1: celular,
                    contato2: telefone ? telefone : celular,
                    contato3: telefone ? telefone : celular,
                    email: empresa.ds_email,
                    precoPlano: [
                        {
                            plano: produtoComercial.id_ProdutoS4E_c,
                            numeroContrato: "",
                            dataAssinaturaContrato: empresa.DT_CADASTRO,
                            valorTitular: mensalidade,
                            valorDependente: mensalidade,
                            valorAgregado: mensalidade,
                            valorFixo: mensalidade,
                            exigeAdesao: 0,
                            alteraPrecoPlano: 0
                        }
                    ]
                }
            }
            try {
                const empresaS4e = await this.S4eService.includeEmpresa(bodyEmpresa);
                if (empresaS4e) {
                    await this.ApiV3Service.createCarenciaPME(empresaS4e.dados, empresa.DT_CADASTRO);
                    for (const funcionario of params.funcionarios) {
                        const associadoBody = await this.criarFuncionarioBody(params, dataPrimeiroVencimento, funcionario, empresaS4e.dados, produtoComercial.id_ProdutoS4E_c, String(mensalidade) ,TokenV1);
                        console.log('associadoBody: ', associadoBody);
                        const retornoCriarAssociado = await this.S4eService.includeAssociadoPJ(associadoBody);
                        console.log('retorno criar associado: ', retornoCriarAssociado);
                    }
                }
                const paymentStatus = PaymentStatus.EXPORTADO;
                await this.empresaService.ativarPlanoEmpresa(empresa, transaction, paymentStatus);
                const pix = {
                    copiaCola: pagamento.pix ? pagamento.pix.copiaCola : null,
                    qrCode: pagamento.pix ? pagamento.pix.base64: null
                } as Pix
            
                retorno.pix = pix; 
                retorno.linkPagamento = linkPagamento;
                retorno.formaPagamento = formaPagamento



            } catch(error) {
                throw Error(error.message)
            }   
        } else {
            this.logService.writeLog(params.cnpj, 'erro', { local:'empresarial', type: 'erro', data: payment });
            throw new NaoFoiPossivelCriarPagamento()
        }
        return retorno;
    }

    async processDependentes(associado, dataPrimeiroVencimento, planoId, valor: string) {
        const dependents = associado.dependentes;
        const deps: any[] = [];
        const nascimento = await this.parseDate(associado.dataNascimento);
        console.log('nascimento dependente: ', nascimento);
        const dependent = {
            tipo: 1,
            nome: associado.nome,
            dataNascimento: nascimento,
            cpf: associado.cpf,
            sexo: associado.idSexo === 1 ? 0 : 1, // 0 - Feminino, 1 - Masculino
            plano: planoId,
            planoValor: valor.replace('.', ','),
            nomeMae: associado.nomeMae,
            numeroCarteira: "",
            carenciaAtendimento: 0,
            rcaId: 0,
            cd_orientacao_sexual: 0,
            OutraOrientacaoSexual: "",
            cd_ident_genero: 0,
            OutraIdentidadeGenero: "",
            cns: "",
            idExterno: "",
            MMYYYY1Pagamento: Number(dataPrimeiroVencimento.toFormat('yyyy/MM').replace('/', '')),
            observacaoUsuario: "",
            funcionarioCadastro: 0,
            dataCadastroLoteContrato: "",
        };
    
        deps.push(dependent);
    
        // Adicionando dependentes adicionais
        if (Array.isArray(dependents)) {
            for (const item of dependents) {    
                const nascimento = await this.parseDate(item.dataNascimento);
                console.log('nascimento dependente array: ', nascimento);
    
                const newDependent = {
                    nome: item.nome,
                    dataNascimento: nascimento,
                    cpf: item.cpf,
                    cns: item.cns ?? '',
                    sexo: item.idSexo === 1 ? 0 : 1,
                    tipo: item.idParentesco === 10 ? 3 : 4,
                    plano: planoId,
                    numeroProposta: Number(associado.nr_proposta),
                    planoValor: valor.replace('.', ','),
                    nomeMae: item.nomeMae,
                    numeroCarteira: "",
                    carenciaAtendimento: 0,
                    rcaId: 0,
                    cd_orientacao_sexual: 0,
                    OutraOrientacaoSexual: "",
                    cd_ident_genero: 0,
                    OutraIdentidadeGenero: "",
                    idExterno: "",
                    MMYYYY1Pagamento: Number(dataPrimeiroVencimento.toFormat('yyyy/MM').replace('/', '')),
                    funcionarioCadastro: 0,
                    dataCadastroLoteContrato: "",
                };
    
                deps.push(newDependent);
            }
        } else {
            console.error("Dependentes não é um array:", dependents);
        }
    
        return deps;
    }

    async getPlanoId(plano) {
        try {
            const planoData = await this.produtoService.getById(plano);
            return planoData?.id_ProdutoS4E_c || 0;
        } catch (error) {
            console.error("Erro ao buscar o plano:", error);
            return 0;
        }
    }
    async getPlano(plano) {
        try {
          const planoData = await this.produtoService.getById(plano);
          if(planoData){
            return planoData;
          } else {
            throw Error('Plano Não encontrado.' + plano);
          }
        } catch (error) {
          console.error("Erro ao buscar o plano:", error);
          throw Error('Plano Não encontrado.' + plano);
        }
    }

    async getCentroCusto(uf: number) {
        let idcentroCusto = 1;
        switch (uf) {
            case 1:
                idcentroCusto = 2;
                break;
            case 2:
                idcentroCusto = 62;
                break;
            case 3:
                idcentroCusto = 68;
                break;
            case 4:
                idcentroCusto = 55;
                break;
            case 5:
                idcentroCusto = 59;
                break;
            case 6:
                idcentroCusto = 1;
                break;
            case 7:
                idcentroCusto = 65;
                break;
            case 8:
                idcentroCusto = 27;
                break;
            case 9:
                idcentroCusto = 69;
                break;
            case 10:
                idcentroCusto = 54;
                break;
            case 11:
                idcentroCusto = 70;
                break;
            case 12:
                idcentroCusto = 26;
                break;
            case 13:
                idcentroCusto = 58;
                break;
            case 14:
                idcentroCusto = 25;
                break;
            case 15:
                idcentroCusto = 4;
                break;
            case 16:
                idcentroCusto = 71;
                break;
            case 17:
                idcentroCusto = 60;
                break;
            case 18:
                idcentroCusto = 63;
                break;
            case 19:
                idcentroCusto = 44;
                break;
            case 20:
                idcentroCusto = 66;
                break;
            case 21:
                idcentroCusto = 67;
                break;
            case 22:
                idcentroCusto = 64;
                break;
            case 23:
                idcentroCusto = 56;
                break;
            case 24:
                idcentroCusto = 72;
                break;
            case 25:
                idcentroCusto = 30;
                break;
            case 26:
                idcentroCusto = 3;
                break;
            case 27:
                idcentroCusto = 73;
                break;            
        }
        return idcentroCusto;
    }

    async parseDate(dateString: string){
        const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
        console.log('data: ', dateString, parsedDate);
        const formattedDate = format(parsedDate, "yyyy-MM-dd");
        console.log('data final: ', formattedDate);
        return formattedDate;
    }
    
    async criarFuncionarioBody(params, dataPrimeiroVencimento, funcionario, codEmpresa, planoId, valor: string, TokenV1) {        
        const CEP = funcionario.cep.replace('.', '').replace('-','');
        const dependentes = await this.processDependentes(funcionario, dataPrimeiroVencimento, planoId, valor);
        const endereco = await this.S4eService.getEnderecoByCep(CEP);
        const vendedor = await this.tokenService.findTokenParceiroIndividual(params.token);
        const hoje = new Date();
        const formattedDate = format(hoje, "yyyy-MM-dd");
        const nascimento = await this.parseDate(funcionario.dataNascimento);
        console.log('nascimento responsavel: ', nascimento);
    
        return {
            token: TokenV1,
            dados: {
                parcelaRetidaComissao: "0",
                incluirMensalidades: "1",
                parceiro: {
                    codigo: vendedor.nu_cdVendedor4E_tk,
                    tipoCobranca: 1,
                    adesionista: 0,
                    maxMensalidadeId: "1",
                },
                responsavelFinanceiro: {
                    codigoContrato: codEmpresa,
                    nome: funcionario.nome,
                    dataNascimento: nascimento,
                    cpf: funcionario.cpf,
                    sexo: funcionario.id_sexo_a === 1 ? 0 : 1, // 0 - Feminino, 1 - Masculino
                    identidadeNumero: funcionario.rg,
                    identidadeOrgaoExpeditor: "SSP",
                    enderecoBoleto: "",
                    cd_orientacao_sexual: 0,
                    OutraOrientacaoSexual: "",
                    cd_ident_genero: 0,
                    OutraIdentidadeGenero: "",
                    agencia: 0,
                    agencia_dv: 0,
                    conta: 0,
                    conta_dv: 0,
                    contaOperacao: 0,
                    matricula: funcionario.matriculaFuncional,
                    dataApresentacao: "",
                    diaVencimento: dataPrimeiroVencimento.toFormat('dd'),
                    tipoPagamento: 529,
                    origemVenda: 13,
                    observacaoAssociado: "",
                    codSistemaExterno: "",
                    dataAssinaturaContrato: formattedDate,
                    numeroProposta: funcionario.nr_proposta,
                    senhaAssociado: "",
                    endereco: {
                        cep: CEP,
                        tipoLogradouro: String(endereco.IdTipoLogradouro),
                        logradouro: endereco.Logradouro,
                        numero: funcionario.numero,
                        complemento: funcionario.complemento,
                        bairro: String(endereco.IdBairro),
                        municipio: String(endereco.IdMunicipio),
                        uf: String(endereco.IdUf),
                        descricaoUf: endereco.Uf,
                    },
                    contatoResponsavelFinanceiro: [
                        { tipo: 8, dado: funcionario.dddCelular + funcionario.celular },
                        { tipo: 50, dado: funcionario.email },
                    ],
                },
                dependente: dependentes,
            },
            empresa: "",
        };
    }

    async formatarMesAno(dataISO) {
        const date = new Date(dataISO);
    
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = date.getFullYear();
    
        return `${ano}${mes}`;
    }

    async criaBodyPessoaJuridica(empresa: TbEmpresa, dataPrimeiroVencimento: DateTime, valorContrato: number): Promise<TipoPessoaBoletoEmpresa> {
        const uf = await this.ufService.findUfById(empresa.id_UF_e)

        const nossoNumero = `2${Math.floor(Math.random() * 900000) + 100000}${empresa.id_cdempresa}0`;

        const bodyPagamento = {
            pagadorDocumentoTipo: 1,
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