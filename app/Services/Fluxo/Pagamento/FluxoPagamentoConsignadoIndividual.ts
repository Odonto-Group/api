import TbAssociado from "App/Models/TbAssociado";
import FluxoPagamentoStrategy from "./FluxoPagamentoStrategy";
import TbResponsavelFinanceiro from "App/Models/TbResponsavelFinanceiro";
import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import UfService from "App/Services/UfService";
import { MailSenderService } from "App/Services/MailSenderService";
import { inject } from '@adonisjs/core/build/standalone';
import RetornoGeracaoPagamentoIndividual from "App/interfaces/RetornoGeracaoPagamentoIndividual.interface";
import { FormaPagamento } from "App/Enums/FormaPagamento";
import { DateTime } from "luxon";
import { PaymentStatus } from "App/Enums/PaymentStatus";
import Env from '@ioc:Adonis/Core/Env'
import formatNumberBrValue from "App/utils/FormatNumber";
import AdesaoEmailContent from "App/interfaces/AdesaoEmailContent.interface";
import { GrupoPagamento } from "App/Enums/GrupoPagamento";
import S4EService from "App/Services/S4EService";
import { format } from "date-fns";
import AssociadoService from "App/Services/AssociadoService";
import TokenService from "App/Services/TokenService";
import OrgaoService from "App/Services/OrgaoService";
import EnderecoS4e from "App/interfaces/EnderecoS4e";
import LogService from "App/Services/Log/Log";
import ProdutoComercialService from "App/Services/ProdutoComercialService";

@inject()
export default class FluxoPagamentoConsignadoIndividual implements FluxoPagamentoStrategy {

    private emailDefault = Env.get('EMAIL_ENVIO_DEFAULT')

    constructor(
        private associadoService: AssociadoService,
        private S4EService: S4EService,
        //private pagamentoConsignadoService: PagamentoConsignadoService,
        private tokenService: TokenService,
        private ufService: UfService,
        private mailSenderService: MailSenderService,
        private orgaoService: OrgaoService,
        private logService: LogService,
        private produtoService: ProdutoComercialService
    ){this.logService = new LogService();}

    async iniciarFluxoPagamento({associado, responsavelFinanceiro, dataPrimeiroVencimento, transaction, nomePlano, idPlanoS4E, formaPagamento, params}: {associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro, dataPrimeiroVencimento: DateTime, transaction: TransactionClientContract, nomePlano: string, idPlanoS4E:number, formaPagamento: FormaPagamento, params: any}): Promise<RetornoGeracaoPagamentoIndividual> {
        /* let tipoPessoa = {} as TipoPessoaBoletoIndividual
        
        tipoPessoa = await this.criaBodyPessoaFisica(associado, responsavelFinanceiro, dataPrimeiroVencimento); */

        const retorno = {grupoPagamento: GrupoPagamento.CONSIGNADO} as RetornoGeracaoPagamentoIndividual

       /*  const pagamento = {
            pagamentoId: params.pagamento.pagamentoId,
            compraValor: params.pagamento.compraValor,
            orgao: params.pagamento.orgao,
            fontePgd: params.pagamento.fontePgd,
            perfil: params.pagamento.perfil,
            vinculo: params.pagamento.vinculo,
            Desc_cargo: params.pagamento.cargo,
            matricula: params.pagamento.matricula
        }; */
            //const linkPagamento = this.urlP4xLinkPagamento.replace('idPagamento', pagamento.id)

            //await this.pagamentoConsignadoService.blAtivoFalseByCliente(associado.id_associado.toString())

            //await this.pagamentoConsignadoService.removeByClient(tipoPessoa.idAssociado, transaction);

            //await this.pagamentoConsignadoService.savePagamento(associado, pagamento, dataPrimeiroVencimento, transaction);

            //await this.pagamentoPixOdontoCobService.removePagamentoIndividualPix(tipoPessoa.idAssociado, transaction);

            //await this.pagamentoPixOdontoCobService.savePagamentoIndividual(tipoPessoa.idAssociado, associado.nu_vl_mensalidade, pagamento, dataPrimeiroVencimento, transaction);
            
            const planoContent = { 
                NOMEPLANO: nomePlano,
                DATAVENCIMENTO: dataPrimeiroVencimento.toFormat('dd/MM/yyyy'),
                NOMECLIENTE: associado.nm_associado,
                LINKPAGAMENTO: String(associado.id_associado),
                VALORPLANO: formatNumberBrValue(associado.nu_vl_mensalidade),
                METODOPAGAMENTO: formaPagamento
            } as AdesaoEmailContent;
            const dataAdicionada = dataPrimeiroVencimento.plus({months: 1});
            const dataCompetencia = Number(dataAdicionada.toFormat('yyyyMM'))
            const vendedor = await this.tokenService.findTokenParceiroIndividual(params.token);
            let dataDependente = format(associado.dt_nasc, 'yyyy-MM-dd');
            let dataRespFinanc = format(responsavelFinanceiro.dt_NascRespFin, 'yyyy-MM-dd');
            const dependentes:any[] = [];
            const dependent = {
                tipo: 1,
                nome: associado.nm_associado,
                dataNascimento: dataDependente,
                cpf: associado.nu_cpf,
                sexo: associado.id_sexo_a == 1 ? 0 : 1,                    
                plano: idPlanoS4E,
                planoValor:  idPlanoS4E == 124 ? "30" : String(associado.nu_vl_mensalidade / params.qtdVidas).replace('.',','),
                nomeMae: associado.nm_mae,
                numeroCarteira: "",
                carenciaAtendimento: 0,
                rcaId: 0,
                numeroProposta: Number(associado.nr_proposta),
                cd_orientacao_sexual: 0,
                OutraOrientacaoSexual: "",
                cd_ident_genero: 0,
                OutraIdentidadeGenero: "",
                cns: "",
                idExterno: "",		      
                MMYYYY1Pagamento: dataCompetencia,		      
                observacaoUsuario: "",
                funcionarioCadastro: 0,
                dataCadastroLoteContrato: ""
                }
                const parseDate = (dateString) => {
                    const [day, month, year] = dateString.split('/');
                    return new Date(`${year}-${month}-${day}T00:00:00`); // ISO 8601 format
                };
                dependentes.push(dependent);
                const dependents = params.dependentes;
                const produtosDependentes:number[] = [];
                if (Array.isArray(dependents)) {
                    for (const item of dependents) {
                      let planoId = 0;
                      let valor = "";
                      if (item.plano) {
                        if (idPlanoS4E == 124 && !produtosDependentes.includes(item.plano)){
                            produtosDependentes.push(item.plano);
                        }
                        const plano = await this.produtoService.getById(item.plano);
                        if (plano != null) {
                          planoId = plano.id_ProdutoS4E_c;
                        }
                        valor = item.valor_plano;
                      } else {
                        if (idPlanoS4E == 124) {
                            if (!produtosDependentes.includes(994)) {
                                produtosDependentes.push(994);
                            }
                            planoId = 119;
                            valor = "22,90";
                        } else{
                            planoId = idPlanoS4E;
                            valor = String(associado.nu_vl_mensalidade / params.qtdVidas).replace('.', ',');
                        }
                      }
                    if (idPlanoS4E == 124 && !produtosDependentes.includes(item.plano)){
                        produtosDependentes.push(item.plano);
                    }
                    const nascimento = parseDate(item.dataNascimento);
                    const dependent = {
                        nome: item.nome,
                        dataNascimento: format( nascimento, 'yyyy-MM-dd'),
                        cpf: item.cpf,
                        cns: item.cns ?? '',
                        sexo: item.idSexo == 1 ? 0 : 1,
                        tipo: item.idParentesco == 10 ? 3 : 4,
                        plano: planoId,
                        numeroProposta: Number(associado.nr_proposta),
                        planoValor: valor,
                        nomeMae: item.nomeMae,
                        numeroCarteira: "",
                        carenciaAtendimento: 0,
                        rcaId: 0,
                        cd_orientacao_sexual: 0,
                        OutraOrientacaoSexual: "",
                        cd_ident_genero: 0,
                        OutraIdentidadeGenero: "",
                        idExterno: "",	
                        MMYYYY1Pagamento: dataCompetencia,                            
                        funcionarioCadastro: 0,
                        dataCadastroLoteContrato: ""
                    };
                    dependentes.push(dependent);
                    };
                } else {
                    console.error("dependents não é um array:", dependents);
                }

            const endereco: EnderecoS4e  = await this.S4EService.getEnderecoByCep(responsavelFinanceiro.nu_CEP);
            const Orgao = await this.orgaoService.getOrgaoWithCodOrgao(params.orgao);
            const TokenV1 = Env.get('S4E_TOKEN_V1');
            const associadoBody = {
                token: TokenV1,
                dados:{
                    parcelaRetidaComissao: "0",
                    incluirMensalidades: "1",
                    parceiro: {
                      codigo: vendedor.nu_cdVendedor4E_tk,
                      tipoCobranca: 1,
                      adesionista: 0,
                      maxMensalidadeId: "1"
                    },
                    responsavelFinanceiro: {
                      codigoContrato: associado.cd_CodContratoS4E,
                      nome: responsavelFinanceiro.nm_RespFinanc,
                      dataNascimento: dataRespFinanc,
                      cpf: responsavelFinanceiro.nu_CPFRespFin,
                      sexo: associado.id_sexo_a == 1 ? 0 : 1,//0 - Feminino, 1 - Masculino
                      identidadeNumero: params.rg,
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
                      matricula: params.matricula,
		              dataApresentacao: "",
                      diaVencimento: dataPrimeiroVencimento.toFormat('dd'),
		              tipoPagamento: 529,
                      origemVenda: 13,
		              departamento: Orgao.nu_CodDeptoEmpS4E_o,
                      observacaoAssociado: "",
                      codSistemaExterno: "",
                      dataAssinaturaContrato: dataPrimeiroVencimento.toFormat('yyyy-MM-dd'),
                      numeroProposta: associado.nr_proposta,
		              senhaAssociado: "",
                      endereco: {
                        cep: responsavelFinanceiro.nu_CEP,
                        tipoLogradouro: String(endereco.IdTipoLogradouro),
                        logradouro: responsavelFinanceiro.tx_EndLograd,
                        numero: responsavelFinanceiro.tx_EndNumero,
                        complemento: responsavelFinanceiro.tx_EndCompl,
                        bairro: String(endereco.IdBairro),
                        municipio: String(endereco.IdMunicipio),
                        uf: String(endereco.IdUf),
                        descricaoUf: endereco.Uf
                      },
                      fl_AlteraSituacao: 0,
                      contatoResponsavelFinanceiro: [
                            {
                                "tipo": 8,
                                "dado": params.responsavelFinanceiro.telefone
                            },
                            {
                                "tipo": 50,
                                "dado": params.responsavelFinanceiro.email
                            },
                        ],
                    },
                    dependente: dependentes,
                },
                empresa:""
            }
            try{
                const associadoPJ = await this.S4EService.includeAssociadoPJ(associadoBody);
                this.logService.writeLog(params.proposta, 'FluxoPagamento', { local:'individual', type: 'api', data: associadoPJ });
                if (associadoPJ){
                    if (associadoPJ.codigo == 3){
                        throw new Error(associadoPJ.mensagem);
                    }
                    /* const bodyCrm = {
                        token: TokenV1,
                        motivoDetalhadoId: 611,
                        descricao: `Nova Adesão Servidor GDF`,
                        tipoUsuario: 3,
                        usuarioId: 7021,
                        tipoSolicitanteId: 3,
                        solicitanteId: 7021,
                        arquivo: "",
                        extensao: "",
                        mostraPortal: 0,
                        situacaoChamado: 1
                    } */
                    //const criarCrm = await this.S4EService.includeCrm(bodyCrm);
                    /* if(criarCrm) {
                        descricao: `Nova Adesão Servidor GDF 
                                        Dados:
                                        nome: ${associado.nm_associado},
                                        Cpf: ${associado.nu_cpf},
                                        Sexo: ${associado.id_sexo_a == 1 ? "Masculino" : "Feminino"},
                                        Matricula: ${associado.nu_MatriculaFuncional},
                                        orgao: ${Orgao.tx_NmOrgao},
                                        situação: ${associado.cd_situacao},
                                        planoId: ${params.idPlanoS4E},
                                        valorTotal: ${associado.nu_vl_mensalidade},
                                        dependentes: ${dependentes}; 
                                    `,
                    } */
                }
            } catch(error) {
                console.log('error message: ', error);
                this.logService.writeLog(params.proposta, 'FluxoPagamento', { local:'individual', type: 'erro', data: error });
                throw new Error(error.message);
            }

            const paymentStatus = PaymentStatus.EXPORTADO;
            await this.associadoService.ativarPlanoAssociado(associado, transaction, paymentStatus);
            await this.mailSenderService.sendEmailAdesaoConsignado(this.emailDefault || responsavelFinanceiro.ds_emailRespFin, 'Bem-vindo à OdontoGroup.', associado.id_prodcomerc_a, produtosDependentes, planoContent)            
            //throw new Error('teste e-mail');

            retorno.formaPagamento = formaPagamento;
            retorno.paymentStatus = paymentStatus;
        return retorno
    }

    async criaBodyPessoaFisica(associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro, dataPrimeiroVencimento: DateTime): Promise<TipoPessoaBoletoIndividual> {
        const uf = await this.ufService.findUfById(associado.id_UF_a)

        const nossoNumero = `2${Math.floor(Math.random() * 900000) + 100000}${associado.id_associado}0`;

        const body = {
            pagadorDocumentoTipo: 1,
            pagadorDocumentoNumero: responsavelFinanceiro.nu_CPFRespFin,
            pagadorNome: responsavelFinanceiro.nm_RespFinanc,
            pagadorEndereco: responsavelFinanceiro.tx_EndLograd,
            pagadorBairro: responsavelFinanceiro.tx_EndBairro,
            pagadorCidade: responsavelFinanceiro.tx_EndCidade,
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
            convenioId: '618aadf0-b8d8-4aeb-aecf-7fcd0ae747cf',
            incluirPix: true,
            };

        let tipoPessoa = {} as TipoPessoaBoletoIndividual
    
        tipoPessoa.idAssociado = associado.id_associado;
        tipoPessoa.numeroProsposta = associado.nr_proposta;
        tipoPessoa.primeiroNome = associado.nm_associado.split(' ')[0];
        tipoPessoa.email = associado.ds_email;
        tipoPessoa.bodyPagamento = body;

        return tipoPessoa
    }

}