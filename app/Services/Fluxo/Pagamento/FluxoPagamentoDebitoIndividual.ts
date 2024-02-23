import RetornoGeracaoPagamentoIndividual from "App/interfaces/RetornoGeracaoPagamentoIndividual.interface";
import FluxoPagamentoStrategy from "./FluxoPagamentoStrategy";
import { inject } from '@adonisjs/core/build/standalone';
import PagamentoDebitoService from "App/Services/PagamentoDebitoService";
import TbAssociado from "App/Models/TbAssociado";
import TbResponsavelFinanceiro from "App/Models/TbResponsavelFinanceiro";
import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { FormaPagamento } from "App/Enums/FormaPagamento";
import { DateTime } from "luxon";
import { MailSenderService } from "App/Services/MailSenderService";
import AssociadoService from "App/Services/AssociadoService";
import S4EService from "App/Services/S4EService";
import formatNumberBrValue from "App/utils/FormatNumber";
import Env from '@ioc:Adonis/Core/Env'
import FluxoPagamentoBoletoIndividual from "./FluxoPagamentoBoletoIndividual";
import AdesaoEmailContent from "App/interfaces/AdesaoEmailContent.interface";
import { GrupoPagamento } from "App/Enums/GrupoPagamento";

@inject()
export default class FluxoPagamentoDebitoIndividual implements FluxoPagamentoStrategy {

    private emailDefault = Env.get('EMAIL_ENVIO_DEFAULT')

    constructor(
        private pagamentoDebitoService: PagamentoDebitoService,
        private S4EService: S4EService,
        private mailSenderService: MailSenderService,
        private associadoService: AssociadoService,
        private fluxoPagamentoBoleto: FluxoPagamentoBoletoIndividual
    ) {}

    async iniciarFluxoPagamento({associado, responsavelFinanceiro, dataPrimeiroVencimento, transaction, nomePlano, params}: {associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro, transaction: TransactionClientContract, dataPrimeiroVencimento: DateTime, nomePlano: string, params: any}): Promise<RetornoGeracaoPagamentoIndividual> {
        await this.pagamentoDebitoService.removePagamentoDebitoByIdAssociado(associado, transaction);

        await this.pagamentoDebitoService.savePagamentoDebito(params, associado, dataPrimeiroVencimento, transaction)

        let returnPayment = {grupoPagamento: GrupoPagamento.DEBITO_EM_CONTA} as RetornoGeracaoPagamentoIndividual

        if (params.primeiraBoleto) { // DEBITO COM PRIMEIRA NO BOLETO
            returnPayment = await this.fluxoPagamentoBoleto.iniciarFluxoPagamento({associado, responsavelFinanceiro, transaction, dataPrimeiroVencimento, nomePlano, formaPagamento: FormaPagamento.PRIMEIRA_NO_BOLETO, boletoUnico: 1})
        
            returnPayment.formaPagamento = FormaPagamento.PRIMEIRA_NO_BOLETO
        } else {
            const planoContent = { 
                NOMEPLANO: nomePlano,
                DATAVENCIMENTO: dataPrimeiroVencimento.toFormat('dd/MM/yyyy'),
                NOMECLIENTE: associado.nm_associado,
                VALORPLANO: formatNumberBrValue(associado.nu_vl_mensalidade),
                METODOPAGAMENTO: FormaPagamento.DEBITO_EM_CONTA
            } as AdesaoEmailContent;

            const associadoBody = {
                
                    parcelaRetidaComissao: "0",
                    incluirMensalidades: "1",
                    parceiro: {
                      codigo: 20945,
                      tipoCobranca: 0,
                      adesionista: 0,
                      maxMensalidadeId: "1"
                    },
                    responsavelFinanceiro: {
                      codigoEmpresa: associado.cd_CodContratoS4E,
                      nome: responsavelFinanceiro.nm_RespFinanc,
                      dataNascimento: responsavelFinanceiro.dt_NascRespFin,
                      cpf: responsavelFinanceiro.nu_CPFRespFin,
                      sexo: associado.id_sexo_a,//TODO inserir sexo do responsavel financeiro
                      cd_orientacao_sexual: 0,
                      cd_ident_genero: 0,
                      agencia: 1,//params.agencia,
                      agencia_dv: 1,//params.agencia.substring(params.agencia.lengh-1),//TODO
                      conta: 1,//params.conta,
                      conta_dv: null,
                      contaOperacao: 1,//TODO adicionar opção poupança
                      matricula: "",
                      diaVencimento: dataPrimeiroVencimento.toFormat('DD'),
                      tipoPagamento: 224,
                      dataAssinaturaContrato: associado.dt_Cadastro,
                      numeroProposta: associado.nr_proposta,
                      endereco: {
                        cep: responsavelFinanceiro.nu_CEP,
                        tipoLogradouro: "803",//TODO dominio tipoLogradouro
                        logradouro: responsavelFinanceiro.tx_EndLograd,
                        numero: responsavelFinanceiro.tx_EndNumero,
                        complemento: responsavelFinanceiro.tx_EndCompl,
                        bairroId: 7261,//TODO dominio bairro
                        municipioId: 5005,//TODO dominio municipio
                        ufId: 6,//TODO dominio UF
                        descricaoUf: responsavelFinanceiro.id_uf_rf
                      },
                      contatos: [
                        {
                          tipo: 50,
                          dado: responsavelFinanceiro.ds_emailRespFin
                        },
                        {
                            tipo: 8,
                            dado: associado.nu_dddCel+associado.nu_Celular
                          }
                      ],
                    },
                    dependentes: [
                      {
                        nome: associado.nm_associado,
                        dataNascimento: associado.dt_nasc,
                        cpf: associado.nu_cpf,
                        sexo: associado.id_sexo_a,
                        grauParentesco: associado.id_parentesco_a,
                        plano: associado.id_prodcomerc_a,//TODO pegar plano S4E
                        planoValor: associado.nu_vl_mensalidade,
                        nomeMae: associado.nm_mae,
                        carenciaAtendimento: 3,
                        cdOrientacaoSexual: 0,
                        cdIdentidadeGenero: 0,
                        mmyyyY1Pagamento: dataPrimeiroVencimento.toFormat('yyyy/MM'),
                        funcionarioCadastro: 0
                      }
                    ]
                  
            }

            await this.S4EService.includeAssociado(associadoBody)
            
            await this.mailSenderService.sendEmailAdesaoSemLinkPagamento(this.emailDefault || responsavelFinanceiro.ds_emailRespFin, 'Bem-vindo à OdontoGroup.', planoContent)

            await this.associadoService.ativarPlanoAssociado(associado, transaction, 3);

            returnPayment.formaPagamento = FormaPagamento.DEBITO_EM_CONTA;
            returnPayment.agencia = params.agencia;
            returnPayment.conta = params.conta;
      }

      return returnPayment   
    }

}