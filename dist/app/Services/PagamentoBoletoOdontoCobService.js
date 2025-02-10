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
const TbPagamentoBoletoOdontoCob_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbPagamentoBoletoOdontoCob"));
const luxon_1 = require("luxon");
class PagamentoBoletoOdontoCobService {
    savePagamentoEfetuadoOdontoCob(nossoNumero, params, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let pagamentoBoletoOdontoCob = yield this.findByNossoNumero(nossoNumero);
            pagamentoBoletoOdontoCob.dt_pagamento = luxon_1.DateTime.fromFormat(params.data, 'dd/MM/yyyy').toString();
            pagamentoBoletoOdontoCob.vl_valorpago = pagamentoBoletoOdontoCob.nu_valoremissao;
            pagamentoBoletoOdontoCob.nu_statusboleto = 1;
            yield pagamentoBoletoOdontoCob.useTransaction(transaction).save();
            return pagamentoBoletoOdontoCob;
        });
    }
    findByNossoNumero(nossoNumero) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield TbPagamentoBoletoOdontoCob_1.default.query()
                .where('nossoNumero', nossoNumero)
                .first()) || new TbPagamentoBoletoOdontoCob_1.default;
        });
    }
    blAtivoFalseByCliente(idAssociado) {
        return __awaiter(this, void 0, void 0, function* () {
            yield TbPagamentoBoletoOdontoCob_1.default.query()
                .where('cd_cliente', idAssociado)
                .update({ blAtivo: false });
        });
    }
    removeByClient(client, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield TbPagamentoBoletoOdontoCob_1.default.query()
                .where('cd_cliente', client)
                .useTransaction(transaction)
                .delete();
        });
    }
    savePagamento(idClient, geraOc, dataPrimeiroVencimento, linkPagamento, tipoPessoa, numeroProsposta, boletoUnico, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const pagamento = new TbPagamentoBoletoOdontoCob_1.default;
            pagamento.cd_cliente = idClient;
            pagamento.dt_emissao = luxon_1.DateTime.now().toString();
            pagamento.id_banco_pbo = 69;
            pagamento.nu_idboleto_odontocob = geraOc.id;
            pagamento.nu_valoremissao = geraOc.registro.titulo.valorNominal;
            pagamento.dt_vencimento = dataPrimeiroVencimento.toString();
            pagamento.tx_linkboleto_odontocob = linkPagamento;
            pagamento.nu_statusboleto = 0;
            pagamento.nu_unico = 0;
            pagamento.tx_linhaDigitavel = geraOc.registro.linhaDigitavel;
            pagamento.tx_codigoBarra = geraOc.registro.codigoBarra;
            pagamento.tipo_cliente = tipoPessoa;
            pagamento.nossoNumero = geraOc.registro.titulo.nossoNumero;
            pagamento.nr_proposta = numeroProsposta;
            pagamento.blAtivo = true;
            pagamento.nu_unico = boletoUnico;
            yield pagamento.useTransaction(transaction).save();
        });
    }
}
exports.default = PagamentoBoletoOdontoCobService;
//# sourceMappingURL=PagamentoBoletoOdontoCobService.js.map