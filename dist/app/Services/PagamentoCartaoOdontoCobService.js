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
const TbPagamentoCartaoOdontoCob_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbPagamentoCartaoOdontoCob"));
const luxon_1 = require("luxon");
class PagamentoCartaoOdontoCobService {
    findByAssociado(idAssociado) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield TbPagamentoCartaoOdontoCob_1.default.query()
                .where('cd_associado_pco', idAssociado)
                .first()) || new TbPagamentoCartaoOdontoCob_1.default;
        });
    }
    savePagamento(associado, pagamentoGerado, dataVencimento, linkPagamento, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const pagamento = new TbPagamentoCartaoOdontoCob_1.default;
            pagamento.cd_associado_pco = associado.id_associado;
            pagamento.tx_token = pagamentoGerado.cartaoId;
            pagamento.vl_valor = pagamentoGerado.compraValor;
            pagamento.dt_cadastro = luxon_1.DateTime.now().toString();
            pagamento.dt_vencimento = dataVencimento;
            pagamento.nr_proposta = pagamentoGerado.compraId;
            pagamento.blAtivo = 1;
            pagamento.linkPgto = linkPagamento;
            console.log('pagamento: ', pagamento);
            yield pagamento.useTransaction(transaction).save();
        });
    }
    savePagamentoEfetuadoOdontoCob(associado, params, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let pagamentoCartaoOdontoCob = yield this.findByAssociado(associado.id_associado);
            pagamentoCartaoOdontoCob.cd_associado_pco = associado.id_associado;
            pagamentoCartaoOdontoCob.vl_valor = pagamentoCartaoOdontoCob.vl_valor || associado.nu_vl_mensalidade;
            pagamentoCartaoOdontoCob.nr_proposta = params.compraId;
            pagamentoCartaoOdontoCob.tx_token = pagamentoCartaoOdontoCob.tx_token || "0";
            pagamentoCartaoOdontoCob.dt_vencimento = pagamentoCartaoOdontoCob.dt_vencimento || associado.dt_inicio_vigencia;
            pagamentoCartaoOdontoCob.pagamentoId = params.pagamentoId;
            pagamentoCartaoOdontoCob.dt_pagamento = luxon_1.DateTime.now().toString();
            pagamentoCartaoOdontoCob.nsu = params.transacao.nsu;
            pagamentoCartaoOdontoCob.autorizacaoCodigo = params.transacao.autorizacaoCodigo || params.transacao.autorizacao;
            pagamentoCartaoOdontoCob.cartaoId = params.transacao.nsu;
            pagamentoCartaoOdontoCob.useTransaction(transaction).save();
        });
    }
    deletePagamento(associado, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield TbPagamentoCartaoOdontoCob_1.default
                .query()
                .where('cd_associado_pco', associado.id_associado)
                .useTransaction(transaction)
                .delete();
        });
    }
}
exports.default = PagamentoCartaoOdontoCobService;
//# sourceMappingURL=PagamentoCartaoOdontoCobService.js.map