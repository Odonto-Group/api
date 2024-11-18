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
const fold_1 = require("@adonisjs/fold");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const WebhookPixValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/WebhookPixValidator"));
const WebhookBoletoValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/WebhookBoletoValidator"));
const WebhookCartaoCreditoValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/WebhookCartaoCreditoValidator"));
const ConfirmacaoPagamentoPix_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Fluxo/Confimacao/Pagamento/ConfirmacaoPagamentoPix"));
const ConfirmacaoPagamentoCartaoCredito_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Fluxo/Confimacao/Pagamento/ConfirmacaoPagamentoCartaoCredito"));
const ConfirmacaoPagamentoBoleto_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Fluxo/Confimacao/Pagamento/ConfirmacaoPagamentoBoleto"));
let WebhookController = class WebhookController {
    constructor(confirmacaoPagamentoPix, confirmacaoPagamentoBoleto, confirmacaoPagamentoCartaoCredito) {
        this.confirmacaoPagamentoPix = confirmacaoPagamentoPix;
        this.confirmacaoPagamentoBoleto = confirmacaoPagamentoBoleto;
        this.confirmacaoPagamentoCartaoCredito = confirmacaoPagamentoCartaoCredito;
    }
    index({ request }) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = yield request.validate(WebhookBoletoValidator_1.default);
            let response = {
                mensagem: ''
            };
            yield Database_1.default.transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                try {
                    response.mensagem = yield this.confirmacaoPagamentoBoleto.confirmarPagamento(params, transaction);
                    transaction.commit();
                }
                catch (error) {
                    response.mensagem = "ERRO";
                    transaction.rollback();
                    throw error;
                }
            }));
            return response;
        });
    }
    creditCardPayment({ request }) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = yield request.validate(WebhookCartaoCreditoValidator_1.default);
            let response = {
                mensagem: ''
            };
            yield Database_1.default.transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                try {
                    response.mensagem = yield this.confirmacaoPagamentoCartaoCredito.confirmarPagamento(params, transaction);
                    transaction.commit();
                }
                catch (error) {
                    response.mensagem = "ERRO";
                    transaction.rollback();
                    throw error;
                }
            }));
            return response;
        });
    }
    pixPayment({ request }) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = yield request.validate(WebhookPixValidator_1.default);
            let response = {
                mensagem: ''
            };
            yield Database_1.default.transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                try {
                    response.mensagem = yield this.confirmacaoPagamentoPix.confirmarPagamento(params, transaction);
                    transaction.commit();
                }
                catch (error) {
                    response.mensagem = "ERRO";
                    transaction.rollback();
                    throw error;
                }
            }));
            return response;
        });
    }
};
WebhookController = __decorate([
    (0, fold_1.inject)(),
    __metadata("design:paramtypes", [ConfirmacaoPagamentoPix_1.default,
        ConfirmacaoPagamentoBoleto_1.default,
        ConfirmacaoPagamentoCartaoCredito_1.default])
], WebhookController);
exports.default = WebhookController;
//# sourceMappingURL=WebhookController.js.map