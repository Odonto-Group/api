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
const TbPagamentoBoleto_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbPagamentoBoleto"));
const luxon_1 = require("luxon");
class PagamentoBoletoService {
    savePagamentoEfetuado(associado, params, pagamentoOdontoCob, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const tbPagamentoBoleto = new TbPagamentoBoleto_1.default;
            tbPagamentoBoleto.cd_associado_pb = associado.id_associado;
            tbPagamentoBoleto.id_banco_pb = 69;
            tbPagamentoBoleto.nu_nossonum = params.nossoNumero;
            tbPagamentoBoleto.nu_IdBolSimples = params.boletoId;
            tbPagamentoBoleto.nu_valoremissao = pagamentoOdontoCob.nu_valoremissao;
            tbPagamentoBoleto.dt_vencimento = pagamentoOdontoCob.dt_pagamento;
            tbPagamentoBoleto.dt_emissao = pagamentoOdontoCob.dt_emissao;
            tbPagamentoBoleto.dt_pagamento = luxon_1.DateTime.now().toString();
            tbPagamentoBoleto.nu_statusboleto = 0;
            tbPagamentoBoleto.nu_unico = pagamentoOdontoCob.nu_unico;
            tbPagamentoBoleto.vl_valorpago = pagamentoOdontoCob.vl_valorpago;
            yield tbPagamentoBoleto.useTransaction(transaction).save();
        });
    }
}
exports.default = PagamentoBoletoService;
//# sourceMappingURL=PagamentoBoletoService.js.map