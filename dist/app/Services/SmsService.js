"use strict";
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
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const node_fetch_1 = __importDefault(require("node-fetch"));
class SmsService {
    constructor() {
        this.smsDefaultTeste = Env_1.default.get('SMS_ENVIO_DEFAULT');
    }
    sendSmsUrlValidacaoCodigo(number) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = Math.floor(Math.random() * 9000) + 1000;
            const payload = {
                body: `Seu código de verificação é: ${code}`,
                to: this.smsDefaultTeste || number,
            };
            try {
                yield (0, node_fetch_1.default)(Env_1.default.get('SMS_PROVIDER_URL'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Env_1.default.get('SMS_PROVIDER_TOKEN')}`,
                    },
                    body: JSON.stringify(payload),
                });
                return code;
            }
            catch (error) {
                console.error('Erro ao enviar SMS:', error);
                throw new Error('Erro ao enviar SMS');
            }
        });
    }
    ;
    sendSmsUrlAdesao(number, plano, nomeCliente, linkPagamento) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                body: `Prezado(a) ${nomeCliente},
      Gostaríamos de informar que sua adesão do plano ${plano}
      está quase concluída, segue o link do pagamento: ${linkPagamento}.
      OdontoGroup Sistema de Saúde`,
                to: this.smsDefaultTeste || number,
            };
            try {
                yield (0, node_fetch_1.default)(Env_1.default.get('SMS_PROVIDER_URL'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Env_1.default.get('SMS_PROVIDER_TOKEN')}`,
                    },
                    body: JSON.stringify(payload),
                });
            }
            catch (error) {
                console.error('Erro ao enviar SMS:', error);
                throw new Error('Erro ao enviar SMS');
            }
        });
    }
    ;
    enviaSmsResponsavelAdesao(responsavelFinanceiroBanco, associado, plano, linkPagamento) {
        return __awaiter(this, void 0, void 0, function* () {
            if (responsavelFinanceiroBanco) {
                yield this.sendSmsUrlAdesao(responsavelFinanceiroBanco.nu_dddRespFin + responsavelFinanceiroBanco.nu_telRespFin, associado.nm_associado, plano, linkPagamento);
            }
            else {
                yield this.sendSmsUrlAdesao(associado.nu_dddCel + associado.nu_Celular, associado.nm_associado, plano, linkPagamento);
            }
        });
    }
    sendSmsUrlPagamentoExecutado(number, nomeCliente) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                body: `Seja bem-vindo(a) à OdontoGroup ${nomeCliente}!
      Pagamentos com cartão de crédito, débito em conta
      e boleto bancário podem levar até 72 horas úteis
      para serem confirmados no sistema. Já para pagamento
      em desconto em folha, o prazo é de até 7 dias úteis.
      
      A partir de agora, você terá acesso a uma ampla rede
      de dentistas e serviços odontológicos de qualidade,
      além de um atendimento personalizado e exclusivo para
      os nossos clientes. Esperamos que esteja tão
      empolgado(a) quanto nós em iniciar essa parceria.
      
      OdontoGroup Sistema de Saúde`,
                to: this.smsDefaultTeste || number,
            };
            try {
                yield (0, node_fetch_1.default)(Env_1.default.get('SMS_PROVIDER_URL'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Env_1.default.get('SMS_PROVIDER_TOKEN')}`,
                    },
                    body: JSON.stringify(payload),
                });
            }
            catch (error) {
                console.error('Erro ao enviar SMS:', error);
                throw new Error('Erro ao enviar SMS');
            }
        });
    }
    ;
    enviaSmsResponsavelPagamentoEfetuado(responsavelFinanceiroBanco, associado) {
        return __awaiter(this, void 0, void 0, function* () {
            if (responsavelFinanceiroBanco) {
                yield this.sendSmsUrlPagamentoExecutado(responsavelFinanceiroBanco.nu_dddRespFin + responsavelFinanceiroBanco.nu_telRespFin, associado.nm_associado);
            }
            else {
                yield this.sendSmsUrlPagamentoExecutado(associado.nu_dddCel + associado.nu_Celular, associado.nm_associado);
            }
        });
    }
}
exports.default = SmsService;
//# sourceMappingURL=SmsService.js.map