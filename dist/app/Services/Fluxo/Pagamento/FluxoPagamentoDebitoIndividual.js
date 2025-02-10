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
const standalone_1 = require("@adonisjs/core/build/standalone");
const PagamentoDebitoService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/PagamentoDebitoService"));
const FormaPagamento_1 = global[Symbol.for('ioc.use')]("App/Enums/FormaPagamento");
const MailSenderService_1 = global[Symbol.for('ioc.use')]("App/Services/MailSenderService");
const AssociadoService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/AssociadoService"));
const S4EService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/S4EService"));
const FormatNumber_1 = __importDefault(global[Symbol.for('ioc.use')]("App/utils/FormatNumber"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const FluxoPagamentoBoletoIndividual_1 = __importDefault(require("./FluxoPagamentoBoletoIndividual"));
const GrupoPagamento_1 = global[Symbol.for('ioc.use')]("App/Enums/GrupoPagamento");
const date_fns_1 = require("date-fns");
let FluxoPagamentoDebitoIndividual = class FluxoPagamentoDebitoIndividual {
    constructor(pagamentoDebitoService, S4EService, mailSenderService, associadoService, fluxoPagamentoBoleto) {
        this.pagamentoDebitoService = pagamentoDebitoService;
        this.S4EService = S4EService;
        this.mailSenderService = mailSenderService;
        this.associadoService = associadoService;
        this.fluxoPagamentoBoleto = fluxoPagamentoBoleto;
        this.emailDefault = Env_1.default.get('EMAIL_ENVIO_DEFAULT');
    }
    iniciarFluxoPagamento({ associado, responsavelFinanceiro, dataPrimeiroVencimento, transaction, nomePlano, idPlanoS4E, params }) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataDependente = (0, date_fns_1.format)(associado.dt_nasc, 'dd/MM/yyyy');
            let dataRespFinanc = (0, date_fns_1.format)(responsavelFinanceiro.dt_NascRespFin, 'dd/MM/yyyy');
            yield this.pagamentoDebitoService.removePagamentoDebitoByIdAssociado(associado, transaction);
            yield this.pagamentoDebitoService.savePagamentoDebito(params, associado, dataPrimeiroVencimento, transaction);
            let returnPayment = { grupoPagamento: GrupoPagamento_1.GrupoPagamento.DEBITO_EM_CONTA };
            if (params.primeiraBoleto) {
                returnPayment = yield this.fluxoPagamentoBoleto.iniciarFluxoPagamento({ associado, responsavelFinanceiro, transaction, dataPrimeiroVencimento, nomePlano, idPlanoS4E, formaPagamento: FormaPagamento_1.FormaPagamento.PRIMEIRA_NO_BOLETO, boletoUnico: 1 });
                returnPayment.formaPagamento = FormaPagamento_1.FormaPagamento.PRIMEIRA_NO_BOLETO;
            }
            else {
                const planoContent = {
                    NOMEPLANO: nomePlano,
                    DATAVENCIMENTO: dataPrimeiroVencimento.toFormat('dd/MM/yyyy'),
                    NOMECLIENTE: associado.nm_associado,
                    VALORPLANO: (0, FormatNumber_1.default)(associado.nu_vl_mensalidade),
                    METODOPAGAMENTO: FormaPagamento_1.FormaPagamento.DEBITO_EM_CONTA
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
                        agencia: Number(params.agencia),
                        agencia_dv: Number(params.agencia.substring(params.agencia.length - 1)),
                        conta: params.conta,
                        conta_dv: null,
                        contaOperacao: 1,
                        diaVencimento: dataPrimeiroVencimento.toFormat('dd'),
                        tipoPagamento: 241,
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
                    dependentes: [
                        {
                            nome: associado.nm_associado,
                            dataNascimento: dataDependente,
                            cpf: associado.nu_cpf,
                            sexo: associado.id_sexo_a == 1 ? 0 : 1,
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
                        }
                    ]
                };
                yield this.S4EService.includeAssociado(associadoBody);
                yield this.mailSenderService.sendEmailAdesaoSemLinkPagamento(this.emailDefault || responsavelFinanceiro.ds_emailRespFin, 'Bem-vindo à OdontoGroup.', planoContent);
                yield this.associadoService.ativarPlanoAssociado(associado, transaction, 3);
                returnPayment.formaPagamento = FormaPagamento_1.FormaPagamento.DEBITO_EM_CONTA;
                returnPayment.agencia = params.agencia;
                returnPayment.conta = params.conta;
            }
            return returnPayment;
        });
    }
};
FluxoPagamentoDebitoIndividual = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [PagamentoDebitoService_1.default,
        S4EService_1.default,
        MailSenderService_1.MailSenderService,
        AssociadoService_1.default,
        FluxoPagamentoBoletoIndividual_1.default])
], FluxoPagamentoDebitoIndividual);
exports.default = FluxoPagamentoDebitoIndividual;
//# sourceMappingURL=FluxoPagamentoDebitoIndividual.js.map