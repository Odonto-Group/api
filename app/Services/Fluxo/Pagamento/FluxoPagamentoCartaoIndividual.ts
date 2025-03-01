import TbAssociado from "App/Models/TbAssociado";
import FluxoPagamentoStrategy from "./FluxoPagamentoStrategy";
import TbResponsavelFinanceiro from "App/Models/TbResponsavelFinanceiro";
import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import UfService from "App/Services/UfService";
import PagamentoCartaoOdontoCobService from "App/Services/PagamentoCartaoOdontoCobService";
import { MailSenderService } from "App/Services/MailSenderService";
import { inject } from '@adonisjs/core/build/standalone';
import RetornoGeracaoPagamentoIndividual from "App/interfaces/RetornoGeracaoPagamentoIndividual.interface";
import { FormaPagamento } from "App/Enums/FormaPagamento";
import { PaymentStatus } from "App/Enums/PaymentStatus";
import { DateTime } from "luxon";
import NaoFoiPossivelCriarPagamento from "App/Exceptions/NaoFoiPossivelEfetuarPagamento";
import P4XService from "App/Services/P4XService";
import S4EService from "App/Services/S4EService";
import { TipoTransacao } from "App/Enums/TipoTransacao";
import Env from '@ioc:Adonis/Core/Env'
import { SituacaoRetornoCartao } from "App/Enums/SituacaoRetornoCartao";
import creditCardType from 'credit-card-type';
import AssociadoService from "App/Services/AssociadoService";
import formatNumberBrValue from "App/utils/FormatNumber";
import AdesaoEmailContent from "App/interfaces/AdesaoEmailContent.interface";
import { GrupoPagamento } from "App/Enums/GrupoPagamento";
import ConfirmacaoPagamentoCartaoCredito from "App/Services/Fluxo/Confimacao/Pagamento/ConfirmacaoPagamentoCartaoCredito";
import SituacaoPagamentoCartaoDesconhecidaException from "App/Exceptions/SituacaoPagamentoCartaoDesconhecidaException";
import { format } from "date-fns";
import ErroEmailContent from "App/interfaces/ErroEmailContent.interface";

@inject()
export default class FluxoPagamentoCartaoIndividual implements FluxoPagamentoStrategy {

    private emailDefault = Env.get('EMAIL_ENVIO_DEFAULT')
    private urlP4xLinkPagamento = Env.get('URL_P4X_PAGAMENTO_CARTAO') as string
    private bandeiraPadrao = Env.get('BANDEIRA_PADRAO')
    private ambienteLocal = Env.get('NODE_ENV') == 'development';

    constructor(
        private S4EService: S4EService,
        private ufService: UfService,
        private p4XService: P4XService,
        private pagamentoCartaoOdontoCobService: PagamentoCartaoOdontoCobService,
        private mailSenderService: MailSenderService,
        private associadoService: AssociadoService,
        private confirmacaoPagamentoCartaoCredito: ConfirmacaoPagamentoCartaoCredito
    ){}

    async iniciarFluxoPagamento({associado, responsavelFinanceiro, dataPrimeiroVencimento, transaction, nomePlano, idPlanoS4E, params}: {associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro, transaction: TransactionClientContract, dataPrimeiroVencimento: DateTime, nomePlano: string, idPlanoS4E:number, params: any}): Promise<RetornoGeracaoPagamentoIndividual> {
        
      
        await this.pagamentoCartaoOdontoCobService.deletePagamento(associado, transaction);

        const body = await this.buildBodyRequest(associado, responsavelFinanceiro, params)

        let paymentStatus = PaymentStatus.PENDENTE;
    
        const retorno = {
            formaPagamento: FormaPagamento.CARTAO_CREDITO,
            grupoPagamento: GrupoPagamento.CARTAO_CREDITO,
            paymentStatus: paymentStatus
        } as RetornoGeracaoPagamentoIndividual

        const pagamento = await this.p4XService.geraPagamentoP4XCartaoCredito(body)

        if (pagamento) {
          try{
            const dataD7 = DateTime.local().plus({ days: 7 }).toFormat('yyyy-MM-dd')

            const linkPagamento = this.urlP4xLinkPagamento.replace('idPagamento', pagamento.pagamentoId)
    
            await this.pagamentoCartaoOdontoCobService.savePagamento(associado, pagamento, dataD7, linkPagamento, transaction)

            if (pagamento.situacao == SituacaoRetornoCartao.APROVADA) {
                let dataDependente = format(associado.dt_nasc, 'dd/MM/yyyy');
                let dataRespFinanc = format(responsavelFinanceiro.dt_NascRespFin, 'dd/MM/yyyy');

                /* response.mensagem = await this.confirmacaoPagamentoCartaoCredito.confirmarPagamento(pagamento, associado,paymentStatus, transaction) */

                const planoContent = {
                    NOMECLIENTE: associado.nm_associado
                } as PagamentoEmailContent;

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
                      agencia: 0,
                      agencia_dv: 0,
                      conta: "0",
                      conta_dv: 0,
                      contaOperacao: 0,//TODO adicionar opção poupança
                      diaVencimento: dataPrimeiroVencimento.toFormat('dd'),
                      tipoPagamento: 579,//Tipo pagamento - 2-CARTÃO DE CRÉDITO - P4X
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
                      cartao: {
                        codSeguranca: params.cartaoCredito.codigoSeguranca,
                        pagamentoId: pagamento.pagamentoId,
                        tokenCartao: pagamento.cartaoId
                      },
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
                        planoValor: String(associado.nu_vl_mensalidade).replace('.',','),
                        nomeMae: associado.nm_mae,
                        carenciaAtendimento: 3,
                        cdOrientacaoSexual: 0,
                        cdIdentidadeGenero: 0,
                        mmyyyY1Pagamento: Number(dataPrimeiroVencimento.toFormat('yyyy/MM').replace('/', '')),
                        funcionarioCadastro: 0
                      }//TODO Dependentes
                    ]
                  
            }
                await this.S4EService.includeAssociado(associadoBody);

                paymentStatus = PaymentStatus.EXPORTADO;// No caso de cartão status 1 é considerado pago TODO: Refatorar para status 2 quando refazer o admin
                
                
                await this.associadoService.ativarPlanoAssociado(associado, transaction, paymentStatus);

                await this.mailSenderService.sendEmailPagamentoAprovado(this.emailDefault || responsavelFinanceiro.ds_emailRespFin, 'Bem-vindo à OdontoGroup.', associado.id_prodcomerc_a, planoContent)
            } else if (pagamento.situacao == SituacaoRetornoCartao.NAO_APROVADA) {

                const planoContent = { 
                    NOMEPLANO: nomePlano,
                    DATAVENCIMENTO: dataPrimeiroVencimento.toFormat('dd/MM/yyyy'),
                    NOMECLIENTE: associado.nm_associado,    
                    LINKPAGAMENTO: linkPagamento,
                    VALORPLANO: formatNumberBrValue(associado.nu_vl_mensalidade),
                    METODOPAGAMENTO: FormaPagamento.CARTAO_CREDITO
                } as AdesaoEmailContent;

                await this.mailSenderService.sendEmailAdesaoSemLinkPagamento(this.emailDefault || responsavelFinanceiro.ds_emailRespFin, 'Bem-vindo à OdontoGroup.', planoContent)
            } else {
                throw new SituacaoPagamentoCartaoDesconhecidaException();
            }
    
            retorno.linkPagamento = linkPagamento
            retorno.paymentStatus = paymentStatus
          } catch(error) {
            const planoContent = {
              NOMECLIENTE: associado.nm_associado,
              TIPO_PAGAMENTO: FormaPagamento.CARTAO_CREDITO
          } as ErroEmailContent;
            if(pagamento){
              if (pagamento.situacao == SituacaoRetornoCartao.APROVADA) {
                const cancelamento = await this.p4XService.cancelaPagamentoP4XCartaoCredito(pagamento);
              }              
            };
            await this.mailSenderService.sendEmailErro('erick.calza@odontogroup.com.br','erro ao cadastrar um novo associado', planoContent)
          }
        } else {
            throw new NaoFoiPossivelCriarPagamento()
        }
        return retorno;
      
    }

    private async buildBodyRequest(associado: TbAssociado, responsavelFinanceiro: TbResponsavelFinanceiro, params: any) {
        const uf = await this.ufService.findUfById(associado.id_UF_a);

        const nomeLista = responsavelFinanceiro.nm_RespFinanc.split(" ");

        const expiracaoCartao = params.cartaoCredito.expiracao.split("/");

        const cartaoNumeroFormatado = params.cartaoCredito.numero.replaceAll(" ", "");
        return {
            "id": associado.nr_proposta,
            "valor": associado.nu_vl_mensalidade,
            "comprador": {
              "id": associado.id_associado,
              "documentoNumero": responsavelFinanceiro.nu_CPFRespFin,
              "documentoTipo": "PF",
              "email":  responsavelFinanceiro.ds_emailRespFin,
              "nomeCompleto": responsavelFinanceiro.nm_RespFinanc,
              "primeiroNome": nomeLista[0],
              "ultimoNome": nomeLista[nomeLista.length - 1],
              "enderecoLogradouro": responsavelFinanceiro.tx_EndLograd,
              "enderecoNumero": responsavelFinanceiro.tx_EndNumero,
              "enderecoComplemento": responsavelFinanceiro.tx_EndCompl,
              "enderecoCep": responsavelFinanceiro.nu_CEP,
              "enderecoBairro": responsavelFinanceiro.tx_EndBairro,
              "enderecoCidade": responsavelFinanceiro.tx_EndCidade,
              "enderecoEstado": uf.sigla,
              "telefone": responsavelFinanceiro.nu_telRespFin
            },
            "cartao": {
              "numero": cartaoNumeroFormatado,
              "codigoSeguranca": params.cartaoCredito.codigoSeguranca,
              "nome": params.cartaoCredito.nome, 
              "expiracaoMes": expiracaoCartao[0],
              "expiracaoAno": expiracaoCartao[1],
              "bandeira": this.getBandeiraCartao(cartaoNumeroFormatado),
              "incluirCofre": true
            },
            "tipoTransacao": TipoTransacao.A_VISTA,
            "quantidadeParcelas": 1,
            "convenioId": "ecf1e024-e1a5-4efa-8399-a081a13bf3d8",
            "gerarLinkPagamento": true
          }
    }

    getBandeiraCartao(number) {
        const cardTypes = creditCardType(number);
        
        if (cardTypes && cardTypes.length > 0) {
            return cardTypes[0].type;
        }
    
        return this.ambienteLocal ? this.bandeiraPadrao : 'Unknown';
    }

}