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
const PagamentoPixService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/PagamentoPixService"));
const AssociadoService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/AssociadoService"));
const PagamentoPixOdontoCobService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/PagamentoPixOdontoCobService"));
const MailSenderService_1 = global[Symbol.for('ioc.use')]("App/Services/MailSenderService");
const SmsService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/SmsService"));
const FormaPagamento_1 = global[Symbol.for('ioc.use')]("App/Enums/FormaPagamento");
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
let ConfirmacaoPagamentoPix = class ConfirmacaoPagamentoPix {
    constructor(pagamentoPixService, associadoService, pagamentoPixOdontoCobService, mailSenderService, smsService) {
        this.pagamentoPixService = pagamentoPixService;
        this.associadoService = associadoService;
        this.pagamentoPixOdontoCobService = pagamentoPixOdontoCobService;
        this.mailSenderService = mailSenderService;
        this.smsService = smsService;
        this.emailSuporteOdontoGroup = Env_1.default.get('EMAIL_ODONTO_GROUP_SUPORTE');
        this.emailDefaultTeste = Env_1.default.get('EMAIL_ENVIO_DEFAULT');
    }
    confirmarPagamento(params, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const associado = yield this.associadoService.findAssociadoByCpf(params.pagadorCpfCnpj);
            if (associado && associado.cd_status === 0) {
                const pix = yield this.pagamentoPixOdontoCobService.savePagamentoEfetuadoOdontoCob(associado, params, transaction);
                yield this.associadoService.updateAssociadoPagamentoEfetuado(associado, transaction);
                yield this.pagamentoPixService.savePagamentoEfetuado(associado, pix, transaction);
                const responsavelFinanceiro = associado.responsavelFinanceiro[0];
                yield this.enviarEmailPagamento(associado, responsavelFinanceiro);
                this.smsService.enviaSmsResponsavelPagamentoEfetuado(responsavelFinanceiro, associado);
                transaction.commit();
                return "SUCESSO";
            }
            else {
                const planoContent = {
                    NOMECLIENTE: associado.nm_associado,
                    TIPO_PAGAMENTO: FormaPagamento_1.FormaPagamento.PIX
                };
                yield this.mailSenderService.sendEmailErro(this.emailDefaultTeste || this.emailSuporteOdontoGroup, 'Erro pagamento OdontoGroup.', planoContent);
                return "ERRO";
            }
        });
    }
    enviarEmailPagamento(associado, responsavelFinanceiro) {
        return __awaiter(this, void 0, void 0, function* () {
            const planoContent = {
                NOMECLIENTE: associado.nm_associado
            };
            yield this.mailSenderService.sendEmailPagamentoAprovado(this.emailDefaultTeste || responsavelFinanceiro.ds_emailRespFin, 'Bem-vindo à OdontoGroup.', associado.id_prodcomerc_a, planoContent);
        });
    }
};
ConfirmacaoPagamentoPix = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [PagamentoPixService_1.default,
        AssociadoService_1.default,
        PagamentoPixOdontoCobService_1.default,
        MailSenderService_1.MailSenderService,
        SmsService_1.default])
], ConfirmacaoPagamentoPix);
exports.default = ConfirmacaoPagamentoPix;
//# sourceMappingURL=ConfirmacaoPagamentoPix.js.map