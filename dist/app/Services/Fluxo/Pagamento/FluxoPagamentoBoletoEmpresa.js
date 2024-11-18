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
const EmpresaService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/EmpresaService"));
const MailSenderService_1 = global[Symbol.for('ioc.use')]("App/Services/MailSenderService");
const standalone_1 = require("@adonisjs/core/build/standalone");
const NaoFoiPossivelEfetuarPagamento_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NaoFoiPossivelEfetuarPagamento"));
const P4XService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/P4XService"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const PagamentoPixOdontoCobService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/PagamentoPixOdontoCobService"));
const FormatNumber_1 = __importDefault(global[Symbol.for('ioc.use')]("App/utils/FormatNumber"));
let FluxoPagamentoBoletoEmpresa = class FluxoPagamentoBoletoEmpresa {
    constructor(pagamentoBoletoOdontoCobService, pagamentoPixOdontoCobService, ufService, empresaService, mailSenderService, p4XService) {
        this.pagamentoBoletoOdontoCobService = pagamentoBoletoOdontoCobService;
        this.pagamentoPixOdontoCobService = pagamentoPixOdontoCobService;
        this.ufService = ufService;
        this.empresaService = empresaService;
        this.mailSenderService = mailSenderService;
        this.p4XService = p4XService;
        this.urlP4xLinkPagamento = Env_1.default.get('URL_P4X_PAGAMENTO_BOLETO');
        this.emailDefault = Env_1.default.get('EMAIL_ENVIO_DEFAULT');
    }
    iniciarFluxoPagamento({ empresa, dataPrimeiroVencimento, transaction, nomePlano, formaPagamento }) {
        return __awaiter(this, void 0, void 0, function* () {
            let tipoPessoa = {};
            tipoPessoa = yield this.criaBodyPessoaJuridica(empresa, dataPrimeiroVencimento, empresa.nu_vl_mensalidade);
            const pagamento = yield this.p4XService.geraPagamentoP4XBoleto(tipoPessoa.bodyPagamento);
            const retorno = {};
            console.log('pagamento boleto empresa:', pagamento);
            if (pagamento) {
                const linkPagamento = this.urlP4xLinkPagamento.replace('idPagamento', pagamento.id);
                yield this.pagamentoBoletoOdontoCobService.blAtivoFalseByCliente(empresa.nu_cnpj);
                yield this.pagamentoBoletoOdontoCobService.removeByClient(tipoPessoa.idEmpresa, transaction);
                yield this.pagamentoBoletoOdontoCobService.savePagamento(tipoPessoa.idEmpresa, pagamento, dataPrimeiroVencimento, linkPagamento, "PJ", tipoPessoa.numeroProsposta, 0, transaction);
                yield this.pagamentoPixOdontoCobService.removePagamentoEmpresaPix(tipoPessoa.idEmpresa, transaction);
                yield this.pagamentoPixOdontoCobService.savePagamentoEmpresa(tipoPessoa.idEmpresa, empresa.nu_vl_mensalidade, pagamento, dataPrimeiroVencimento, transaction);
                const planoContent = {
                    NOMEPLANO: nomePlano,
                    DATAVENCIMENTO: dataPrimeiroVencimento.toFormat('dd/MM/yyyy'),
                    NOMECLIENTE: empresa.nm_nome_fantasia,
                    LINKPAGAMENTO: linkPagamento,
                    VALORPLANO: (0, FormatNumber_1.default)(empresa.nu_vl_mensalidade),
                    METODOPAGAMENTO: formaPagamento
                };
                yield this.mailSenderService.sendEmailAdesaoBoleto(this.emailDefault || empresa.ds_email, 'Bem-vindo à OdontoGroup.', planoContent);
                const pix = {
                    copiaCola: pagamento.pix.copiaCola,
                    qrCode: pagamento.pix.base64
                };
                retorno.pix = pix;
                retorno.linkPagamento = linkPagamento;
                retorno.formaPagamento = formaPagamento;
            }
            else {
                console.log('boleto empresarial erro');
                throw new NaoFoiPossivelEfetuarPagamento_1.default();
            }
            return retorno;
        });
    }
    criaBodyPessoaJuridica(empresa, dataPrimeiroVencimento, valorContrato) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const uf = yield this.ufService.findUfById(empresa.id_UF_e);
            const nossoNumero = `2${Math.floor(Math.random() * 900000) + 100000}${empresa.id_cdempresa}0`;
            const bodyPagamento = {
                pagadorDocumentoTipo: 2,
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
                pagadorCelular: `${(_a = empresa.nu_dddcel) !== null && _a !== void 0 ? _a : '00'}${(_b = empresa.nu_celular) !== null && _b !== void 0 ? _b : '000000000'}`,
                smsEnvio: false,
                nossoNumero: nossoNumero,
                convenioId: 'ecf1e024-e1a5-4efa-8399-a081a13bf3d8',
                incluirPix: true,
            };
            let tipoPessoa = {};
            tipoPessoa.idEmpresa = empresa.id_cdempresa;
            tipoPessoa.numeroProsposta = empresa.nr_proposta;
            tipoPessoa.primeiroNome = empresa.nm_responsavel.split(' ')[0];
            tipoPessoa.email = 'suporte@odontogroup.com.br';
            tipoPessoa.bodyPagamento = bodyPagamento;
            return tipoPessoa;
        });
    }
};
FluxoPagamentoBoletoEmpresa = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [PagamentoBoletoOdontoCobService_1.default,
        PagamentoPixOdontoCobService_1.default,
        UfService_1.default,
        EmpresaService_1.default,
        MailSenderService_1.MailSenderService,
        P4XService_1.default])
], FluxoPagamentoBoletoEmpresa);
exports.default = FluxoPagamentoBoletoEmpresa;
//# sourceMappingURL=FluxoPagamentoBoletoEmpresa.js.map