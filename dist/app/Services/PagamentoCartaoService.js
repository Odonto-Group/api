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
const TbPagamentoCartao_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbPagamentoCartao"));
const luxon_1 = require("luxon");
class PagamentoCartaoService {
    savePagamentoEfetuado(associado, params, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const tbPagamentoCartao = new TbPagamentoCartao_1.default;
            tbPagamentoCartao.cd_associado_pc = associado.id_associado;
            tbPagamentoCartao.tid = params.transacao.nsu;
            tbPagamentoCartao.mensagem = 'Transacao capturada com sucesso';
            tbPagamentoCartao.dt_cadastro = luxon_1.DateTime.now().toString();
            tbPagamentoCartao.bandeira = 'a';
            tbPagamentoCartao.nu_mesvalidade = 'a';
            tbPagamentoCartao.nu_anovalidade = 'a';
            tbPagamentoCartao.parcela = 1;
            tbPagamentoCartao.nu_numcartao = params.cartaoId;
            tbPagamentoCartao.cod_autorizacao = params.transacao.autorizacaoCodigo || params.transacao.autorizacao;
            tbPagamentoCartao.vl_valor = associado.nu_vl_mensalidade;
            tbPagamentoCartao.codigoRetorno = '0';
            tbPagamentoCartao.nu_cvv = params.pagamentoId;
            yield tbPagamentoCartao.useTransaction(transaction).save();
        });
    }
}
exports.default = PagamentoCartaoService;
//# sourceMappingURL=PagamentoCartaoService.js.map