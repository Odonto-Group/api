"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UfService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/UfService"));
const PagamentoCartaoOdontoCobService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/PagamentoCartaoOdontoCobService"));
const MailSenderService_1 = global[Symbol.for('ioc.use')]("App/Services/MailSenderService");
const standalone_1 = require("@adonisjs/core/build/standalone");
const FormaPagamento_1 = global[Symbol.for('ioc.use')]("App/Enums/FormaPagamento");
const PaymentStatus_1 = global[Symbol.for('ioc.use')]("App/Enums/PaymentStatus");
const luxon_1 = require("luxon");
const NaoFoiPossivelEfetuarPagamento_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NaoFoiPossivelEfetuarPagamento"));
const P4XService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/P4XService"));
const S4EService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/S4EService"));
const TipoTransacao_1 = global[Symbol.for('ioc.use')]("App/Enums/TipoTransacao");
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const SituacaoRetornoCartao_1 = global[Symbol.for('ioc.use')]("App/Enums/SituacaoRetornoCartao");
const credit_card_type_1 = __importDefault(require("credit-card-type"));
const AssociadoService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/AssociadoService"));
const FormatNumber_1 = __importDefault(global[Symbol.for('ioc.use')]("App/utils/FormatNumber"));
const GrupoPagamento_1 = global[Symbol.for('ioc.use')]("App/Enums/GrupoPagamento");
const ConfirmacaoPagamentoCartaoCredito_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Fluxo/Confimacao/Pagamento/ConfirmacaoPagamentoCartaoCredito"));
const SituacaoPagamentoCartaoDesconhecidaException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/SituacaoPagamentoCartaoDesconhecidaException"));
const date_fns_1 = require("date-fns");
let FluxoPagamentoCartaoIndividual = class FluxoPagamentoCartaoIndividual {
    constructor(S4EService, ufService, p4XService, pagamentoCartaoOdontoCobService, mailSenderService, associadoService, confirmacaoPagamentoCartaoCredito) {
        this.S4EService = S4EService;
        this.ufService = ufService;
        this.p4XService = p4XService;
        this.pagamentoCartaoOdontoCobService = pagamentoCartaoOdontoCobService;
        this.mailSenderService = mailSenderService;
        this.associadoService = associadoService;
        this.confirmacaoPagamentoCartaoCredito = confirmacaoPagamentoCartaoCredito;
        this.emailDefault = Env_1.default.get('EMAIL_ENVIO_DEFAULT');
        this.urlP4xLinkPagamento = Env_1.default.get('URL_P4X_PAGAMENTO_CARTAO');
        this.bandeiraPadrao = Env_1.default.get('BANDEIRA_PADRAO');
        this.ambienteLocal = Env_1.default.get('NODE_ENV') == 'development';
    }
    iniciarFluxoPagamento({ associado, responsavelFinanceiro, dataPrimeiroVencimento, transaction, nomePlano, idPlanoS4E, params }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pagamentoCartaoOdontoCobService.deletePagamento(associado, transaction);
            const body = yield this.buildBodyRequest(associado, responsavelFinanceiro, params);
            let paymentStatus = PaymentStatus_1.PaymentStatus.PENDENTE;
            const retorno = {
                formaPagamento: FormaPagamento_1.FormaPagamento.CARTAO_CREDITO,
                grupoPagamento: GrupoPagamento_1.GrupoPagamento.CARTAO_CREDITO,
                paymentStatus: paymentStatus
            };
            const pagamento = yield this.p4XService.geraPagamentoP4XCartaoCredito(body);
            console.log('pagamento individual cartão:', pagamento);
            if (pagamento) {
                const dataD7 = luxon_1.DateTime.local().plus({ days: 7 }).toFormat('yyyy-MM-dd');
                const linkPagamento = this.urlP4xLinkPagamento.replace('idPagamento', pagamento.pagamentoId);
                yield this.pagamentoCartaoOdontoCobService.savePagamento(associado, pagamento, dataD7, linkPagamento, transaction);
                if (pagamento.situacao == SituacaoRetornoCartao_1.SituacaoRetornoCartao.APROVADA) {
                    let dataDependente = (0, date_fns_1.format)(associado.dt_nasc, 'dd/MM/yyyy');
                    let dataRespFinanc = (0, date_fns_1.format)(responsavelFinanceiro.dt_NascRespFin, 'dd/MM/yyyy');
                    paymentStatus = PaymentStatus_1.PaymentStatus.PRE_CADASTRO;
                    yield this.associadoService.ativarPlanoAssociado(associado, transaction, paymentStatus);
                    const planoContent = {
                        NOMECLIENTE: associado.nm_associado
                    };
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
                            sexo: associado.id_sexo_a == 1 ? 0 : 1,
                            cd_orientacao_sexual: 0,
                            cd_ident_genero: 0,
                            agencia: 0,
                            agencia_dv: 0,
                            conta: "0",
                            conta_dv: 0,
                            contaOperacao: 0,
                            diaVencimento: dataPrimeiroVencimento.toFormat('dd'),
                            tipoPagamento: 579,
                            dataAssinaturaContrato: dataPrimeiroVencimento.toFormat('dd/MM/yyyy'),
                            numeroProposta: associado.nr_proposta,
                            endereco: {
                                cep: responsavelFinanceiro.nu_CEP,
                                tipoLogradouro: "803",
                                logradouro: responsavelFinanceiro.tx_EndLograd,
                                numero: responsavelFinanceiro.tx_EndNumero,
                                complemento: responsavelFinanceiro.tx_EndCompl,
                                bairroId: 7261,
                                municipioId: 5005,
                                ufId: responsavelFinanceiro.id_uf_rf,
                                descricaoUf: "DF"
                            },
                        },
                        cartao: {
                            codSeguranca: params.cartaoCredito.codigoSeguranca,
                            pagamentoId: pagamento.pagamentoId,
                            tokenCartao: pagamento.cartaoId
                        },
                        dependentes: [
                            {
                                nome: associado.nm_associado,
                                dataNascimento: dataDependente,
                                cpf: associado.nu_cpf,
                                sexo: associado.id_sexo_a == 1 ? 0 : 1,
                                grauParentesco: associado.id_parentesco_a,
                                plano: idPlanoS4E,
                                numeroProposta: associado.nr_proposta,
                                planoValor: String(associado.nu_vl_mensalidade),
                                nomeMae: associado.nm_mae,
                                carenciaAtendimento: 3,
                                cdOrientacaoSexual: 0,
                                cdIdentidadeGenero: 0,
                                mmyyyY1Pagamento: Number(dataPrimeiroVencimento.toFormat('yyyy/MM').replace('/', '')),
                                funcionarioCadastro: 0
                            }
                        ]
                    };
                    yield this.S4EService.includeAssociado(associadoBody);
                    yield this.mailSenderService.sendEmailPagamentoAprovado(this.emailDefault || responsavelFinanceiro.ds_emailRespFin, 'Bem-vindo à OdontoGroup.', associado.id_prodcomerc_a, planoContent);
                }
                else if (pagamento.situacao == SituacaoRetornoCartao_1.SituacaoRetornoCartao.NAO_APROVADA) {
                    const planoContent = {
                        NOMEPLANO: nomePlano,
                        DATAVENCIMENTO: dataPrimeiroVencimento.toFormat('dd/MM/yyyy'),
                        NOMECLIENTE: associado.nm_associado,
                        LINKPAGAMENTO: linkPagamento,
                        VALORPLANO: (0, FormatNumber_1.default)(associado.nu_vl_mensalidade),
                        METODOPAGAMENTO: FormaPagamento_1.FormaPagamento.CARTAO_CREDITO
                    };
                    yield this.mailSenderService.sendEmailAdesaoSemLinkPagamento(this.emailDefault || responsavelFinanceiro.ds_emailRespFin, 'Bem-vindo à OdontoGroup.', planoContent);
                }
                else {
                    throw new SituacaoPagamentoCartaoDesconhecidaException_1.default();
                }
                retorno.linkPagamento = linkPagamento;
                retorno.paymentStatus = paymentStatus;
            }
            else {
                console.log('cartão individual erro');
                throw new NaoFoiPossivelEfetuarPagamento_1.default();
            }
            return retorno;
        });
    }
    buildBodyRequest(associado, responsavelFinanceiro, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const uf = yield this.ufService.findUfById(associado.id_UF_a);
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
                    "email": responsavelFinanceiro.ds_emailRespFin,
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
                "tipoTransacao": TipoTransacao_1.TipoTransacao.A_VISTA,
                "quantidadeParcelas": 1,
                "convenioId": "ecf1e024-e1a5-4efa-8399-a081a13bf3d8",
                "gerarLinkPagamento": true
            };
        });
    }
    getBandeiraCartao(number) {
        const cardTypes = (0, credit_card_type_1.default)(number);
        if (cardTypes && cardTypes.length > 0) {
            return cardTypes[0].type;
        }
        return this.ambienteLocal ? this.bandeiraPadrao : 'Unknown';
    }
};
FluxoPagamentoCartaoIndividual = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [S4EService_1.default,
        UfService_1.default,
        P4XService_1.default,
        PagamentoCartaoOdontoCobService_1.default,
        MailSenderService_1.MailSenderService,
        AssociadoService_1.default,
        ConfirmacaoPagamentoCartaoCredito_1.default])
], FluxoPagamentoCartaoIndividual);
exports.default = FluxoPagamentoCartaoIndividual;
//# sourceMappingURL=FluxoPagamentoCartaoIndividual.js.map