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
const TbPagamentoPix_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbPagamentoPix"));
class PagamentoPixService {
    savePagamentoEfetuado(associado, pixOdontoCob, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const tbPagamentoPix = new TbPagamentoPix_1.default;
            tbPagamentoPix.cd_associado = associado.id_associado;
            tbPagamentoPix.id_pix_odontocob = pixOdontoCob.id_pix_odontocob;
            tbPagamentoPix.dt_cadastro = pixOdontoCob.dt_cadastro;
            tbPagamentoPix.dt_pagamento = pixOdontoCob.dt_pagamento;
            tbPagamentoPix.dt_vencimento = pixOdontoCob.dt_vencimento;
            tbPagamentoPix.valor = pixOdontoCob.valor_pago;
            yield tbPagamentoPix.useTransaction(transaction).save();
        });
    }
}
exports.default = PagamentoPixService;
//# sourceMappingURL=PagamentoPixService.js.map