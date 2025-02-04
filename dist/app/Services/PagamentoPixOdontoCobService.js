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
const TbPagamentoPixOdontoCob_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbPagamentoPixOdontoCob"));
const luxon_1 = require("luxon");
class PagamentoPixOdontoCobService {
    removePagamentoEmpresaPix(idEmpresa, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield TbPagamentoPixOdontoCob_1.default.query()
                .where('cd_empresa', idEmpresa)
                .useTransaction(transaction)
                .delete();
        });
    }
    removePagamentoIndividualPix(idAssociado, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield TbPagamentoPixOdontoCob_1.default.query()
                .where('cd_associado', idAssociado)
                .useTransaction(transaction)
                .delete();
        });
    }
    findByAssociado(idAssociado) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield TbPagamentoPixOdontoCob_1.default.query()
                .where('cd_associado', idAssociado)
                .first()) || new TbPagamentoPixOdontoCob_1.default;
        });
    }
    savePagamentoIndividual(id_associado, valor, pagamento, dataPrimeiroVencimento, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const pagamentoOdontoCob = new TbPagamentoPixOdontoCob_1.default;
            pagamentoOdontoCob.cd_associado = id_associado;
            pagamentoOdontoCob.dt_cadastro = luxon_1.DateTime.local().toFormat('yyyy/mm/dd');
            pagamentoOdontoCob.id_pix_odontocob = pagamento.pix ? pagamento.pix.id : null;
            pagamentoOdontoCob.qr_code = pagamento.pix ? pagamento.pix.base64 : null;
            pagamentoOdontoCob.copia_cola = pagamento.pix ? pagamento.pix.copiaCola : null;
            pagamentoOdontoCob.created_at = luxon_1.DateTime.now().toString();
            pagamentoOdontoCob.updated_at = luxon_1.DateTime.now().toString();
            pagamentoOdontoCob.valor = valor;
            pagamentoOdontoCob.dt_vencimento = dataPrimeiroVencimento.toString();
            yield pagamentoOdontoCob.useTransaction(transaction).save();
        });
    }
    savePagamentoEmpresa(idEmpresa, valor, pagamento, dataPrimeiroVencimento, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const pagamentoOdontoCob = new TbPagamentoPixOdontoCob_1.default;
            pagamentoOdontoCob.cd_empresa = idEmpresa;
            pagamentoOdontoCob.dt_cadastro = luxon_1.DateTime.local().toFormat('yyyy/mm/dd');
            pagamentoOdontoCob.created_at = luxon_1.DateTime.now().toString();
            pagamentoOdontoCob.updated_at = luxon_1.DateTime.now().toString();
            pagamentoOdontoCob.id_pix_odontocob = pagamento.pix.id;
            pagamentoOdontoCob.qr_code = pagamento.pix.base64;
            pagamentoOdontoCob.copia_cola = pagamento.pix.copiaCola;
            pagamentoOdontoCob.valor = valor;
            pagamentoOdontoCob.dt_vencimento = dataPrimeiroVencimento.toString();
            yield pagamentoOdontoCob.useTransaction(transaction).save();
        });
    }
    savePagamentoEfetuadoOdontoCob(associado, params, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const pagamentoPixOdontoCob = yield this.findByAssociado(associado.id_associado);
            pagamentoPixOdontoCob.dt_pagamento = luxon_1.DateTime.fromFormat(params.dataPagamento, 'dd/MM/yyyy').toString();
            pagamentoPixOdontoCob.dt_cadastro = luxon_1.DateTime.now().toString();
            pagamentoPixOdontoCob.valor_pago = params.valor;
            pagamentoPixOdontoCob.updated_at = luxon_1.DateTime.now().toString();
            yield pagamentoPixOdontoCob.useTransaction(transaction).save();
            return pagamentoPixOdontoCob;
        });
    }
}
exports.default = PagamentoPixOdontoCobService;
//# sourceMappingURL=PagamentoPixOdontoCobService.js.map