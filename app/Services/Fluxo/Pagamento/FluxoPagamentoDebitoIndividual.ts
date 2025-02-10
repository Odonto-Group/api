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
import {format} from 'date-fns';

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

    async iniciarFluxoPagamento({associado, responsavelFinanceiro, dataPrimeiroVencimento, transaction, nomePlano, idPlanoS4E, params}: {associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro, transaction: TransactionClientContract, dataPrimeiroVencimento: DateTime, nomePlano: string, idPlanoS4E: number, params: any}): Promise<RetornoGeracaoPagamentoIndividual> {
        let dataDependente = format(associado.dt_nasc, 'dd/MM/yyyy');
        let dataRespFinanc = format(responsavelFinanceiro.dt_NascRespFin, 'dd/MM/yyyy');

        await this.pagamentoDebitoService.removePagamentoDebitoByIdAssociado(associado, transaction);

        await this.pagamentoDebitoService.savePagamentoDebito(params, associado, dataPrimeiroVencimento, transaction)

        let returnPayment = {grupoPagamento: GrupoPagamento.DEBITO_EM_CONTA} as RetornoGeracaoPagamentoIndividual

        if (params.primeiraBoleto) { // DEBITO COM PRIMEIRA NO BOLETO
            returnPayment = await this.fluxoPagamentoBoleto.iniciarFluxoPagamento({associado, responsavelFinanceiro, transaction, dataPrimeiroVencimento, nomePlano, idPlanoS4E, formaPagamento: FormaPagamento.PRIMEIRA_NO_BOLETO, boletoUnico: 1})
        
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
                      dataNascimento: dataRespFinanc,
                      cpf: responsavelFinanceiro.nu_CPFRespFin,
                      sexo: associado.id_sexo_a == 1 ? 0 : 1,//0 - Feminino, 1 - Masculino
                      cd_orientacao_sexual: 0,
                      cd_ident_genero: 0,
                      agencia: Number(params.agencia),
                      agencia_dv: Number(params.agencia.substring(params.agencia.length-1)),
                      conta: params.conta,
                      conta_dv: null,
                      contaOperacao: 1,//TODO adicionar opção poupança
                      diaVencimento: dataPrimeiroVencimento.toFormat('dd'),
                      tipoPagamento: 241,
                      dataAssinaturaContrato: dataPrimeiroVencimento.toFormat('dd/MM/yyyy'),
                      numeroProposta: associado.nr_proposta,
                      endereco: {
                        cep: responsavelFinanceiro.nu_CEP,
                        tipoLogradouro: "803",//TODO dominio tipoLogradouro
                        logradouro: responsavelFinanceiro.tx_EndLograd,
                        numero: responsavelFinanceiro.tx_EndNumero,
                        complemento: responsavelFinanceiro.tx_EndCompl,
                        bairroId: 7261,//TODO dominio bairro
                        municipioId: 5005,//TODO dominio municipio
                        ufId: responsavelFinanceiro.id_uf_rf,
                        descricaoUf: "DF"//TODO
                      },
                      /* contatos: [
                        {
                          tipo: 50,
                          dado: responsavelFinanceiro.ds_emailRespFin
                        },
                        {
                            tipo: 8,
                            dado: associado.nu_dddCel+associado.nu_Celular
                          }
                      ] */
                    },
                    dependentes: [
                      {
                        nome: associado.nm_associado,
                        dataNascimento: dataDependente,
                        cpf: associado.nu_cpf,
                        sexo: associado.id_sexo_a == 1 ? 0 : 1,//0 - Feminino, 1 - Masculino
                        grauParentesco: associado.id_parentesco_a,
                        plano: idPlanoS4E,
                        numeroProposta: associado.nr_proposta,
                        planoValor: String(associado.nu_vl_mensalidade).replace('.', ','),
                        nomeMae: associado.nm_mae,
                        carenciaAtendimento: 3,
                        cdOrientacaoSexual: 0,
                        cdIdentidadeGenero: 0,
                        mmyyyY1Pagamento: Number(dataPrimeiroVencimento.toFormat('yyyy/MM').replace('/', '')),
                        funcionarioCadastro: 0
                      }//TODO Dependentes
                    ]
                  
            }
            console.log('chegou o associado: ', associadoBody);
            await this.S4EService.includeAssociado(associadoBody);
            
            await this.mailSenderService.sendEmailAdesaoSemLinkPagamento(this.emailDefault || responsavelFinanceiro.ds_emailRespFin, 'Bem-vindo à OdontoGroup.', planoContent)

            await this.associadoService.ativarPlanoAssociado(associado, transaction, 3);

            returnPayment.formaPagamento = FormaPagamento.DEBITO_EM_CONTA;
            returnPayment.agencia = params.agencia;
            returnPayment.conta = params.conta;
      }

      return returnPayment   
    }

}