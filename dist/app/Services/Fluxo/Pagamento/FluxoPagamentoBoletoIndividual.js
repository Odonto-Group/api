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
const PagamentoBoletoOdontoCobService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/PagamentoBoletoOdontoCobService"));
const UfService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/UfService"));
const MailSenderService_1 = global[Symbol.for('ioc.use')]("App/Services/MailSenderService");
const standalone_1 = require("@adonisjs/core/build/standalone");
const NaoFoiPossivelEfetuarPagamento_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NaoFoiPossivelEfetuarPagamento"));
const P4XService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/P4XService"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const PagamentoPixOdontoCobService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/PagamentoPixOdontoCobService"));
const FormatNumber_1 = __importDefault(global[Symbol.for('ioc.use')]("App/utils/FormatNumber"));
const GrupoPagamento_1 = global[Symbol.for('ioc.use')]("App/Enums/GrupoPagamento");
let FluxoPagamentoBoletoIndividual = class FluxoPagamentoBoletoIndividual {
    constructor(pagamentoBoletoOdontoCobService, pagamentoPixOdontoCobService, ufService, mailSenderService, p4XService) {
        this.pagamentoBoletoOdontoCobService = pagamentoBoletoOdontoCobService;
        this.pagamentoPixOdontoCobService = pagamentoPixOdontoCobService;
        this.ufService = ufService;
        this.mailSenderService = mailSenderService;
        this.p4XService = p4XService;
        this.urlP4xLinkPagamento = Env_1.default.get('URL_P4X_PAGAMENTO_BOLETO');
        this.emailDefault = Env_1.default.get('EMAIL_ENVIO_DEFAULT');
    }
    iniciarFluxoPagamento({ associado, responsavelFinanceiro, dataPrimeiroVencimento, transaction, nomePlano, idPlanoS4E, formaPagamento, boletoUnico }) {
        return __awaiter(this, void 0, void 0, function* () {
            let tipoPessoa = {};
            tipoPessoa = yield this.criaBodyPessoaFisica(associado, responsavelFinanceiro, dataPrimeiroVencimento);
            const pagamento = yield this.p4XService.geraPagamentoP4XBoleto(tipoPessoa.bodyPagamento);
            const retorno = { grupoPagamento: GrupoPagamento_1.GrupoPagamento.BOLETO };
            console.log('pagamento boleto individual:', pagamento);
            if (pagamento) {
                const linkPagamento = this.urlP4xLinkPagamento.replace('idPagamento', pagamento.id);
                yield this.pagamentoBoletoOdontoCobService.blAtivoFalseByCliente(associado.id_associado.toString());
                yield this.pagamentoBoletoOdontoCobService.removeByClient(tipoPessoa.idAssociado, transaction);
                yield this.pagamentoBoletoOdontoCobService.savePagamento(tipoPessoa.idAssociado, pagamento, dataPrimeiroVencimento, linkPagamento, "PF", tipoPessoa.numeroProsposta, boletoUnico, transaction);
                yield this.pagamentoPixOdontoCobService.removePagamentoIndividualPix(tipoPessoa.idAssociado, transaction);
                yield this.pagamentoPixOdontoCobService.savePagamentoIndividual(tipoPessoa.idAssociado, associado.nu_vl_mensalidade, pagamento, dataPrimeiroVencimento, transaction);
                const planoContent = {
                    NOMEPLANO: nomePlano,
                    DATAVENCIMENTO: dataPrimeiroVencimento.toFormat('dd/MM/yyyy'),
                    NOMECLIENTE: associado.nm_associado,
                    LINKPAGAMENTO: linkPagamento,
                    VALORPLANO: (0, FormatNumber_1.default)(associado.nu_vl_mensalidade),
                    METODOPAGAMENTO: formaPagamento
                };
                yield this.mailSenderService.sendEmailAdesaoBoleto(this.emailDefault || responsavelFinanceiro.ds_emailRespFin, 'Bem-vindo à OdontoGroup.', planoContent);
                const pix = {
                    copiaCola: pagamento.pix ? pagamento.pix.copiaCola : null,
                    qrCode: pagamento.pix ? pagamento.pix.base64 : null
                };
                retorno.pix = pix;
                retorno.linkPagamento = linkPagamento;
                retorno.formaPagamento = formaPagamento;
            }
            else {
                console.log('boleto individual erro');
                throw new NaoFoiPossivelEfetuarPagamento_1.default();
            }
            return retorno;
        });
    }
    criaBodyPessoaFisica(associado, responsavelFinanceiro, dataPrimeiroVencimento) {
        return __awaiter(this, void 0, void 0, function* () {
            const uf = yield this.ufService.findUfById(associado.id_UF_a);
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
                valorNominal: (Math.round(associado.nu_vl_mensalidade * 100) / 100).toFixed(2),
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
            let tipoPessoa = {};
            tipoPessoa.idAssociado = associado.id_associado;
            tipoPessoa.numeroProsposta = associado.nr_proposta;
            tipoPessoa.primeiroNome = associado.nm_associado.split(' ')[0];
            tipoPessoa.email = associado.ds_email;
            tipoPessoa.bodyPagamento = body;
            return tipoPessoa;
        });
    }
};
FluxoPagamentoBoletoIndividual = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [PagamentoBoletoOdontoCobService_1.default,
        PagamentoPixOdontoCobService_1.default,
        UfService_1.default,
        MailSenderService_1.MailSenderService,
        P4XService_1.default])
], FluxoPagamentoBoletoIndividual);
exports.default = FluxoPagamentoBoletoIndividual;
//# sourceMappingURL=FluxoPagamentoBoletoIndividual.js.map