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
const TbPagamentoDebito_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbPagamentoDebito"));
class PagamentoDebitoService {
    savePagamentoDebito(params, associado, dataExpiracao, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const pagamentoDebito = new TbPagamentoDebito_1.default;
            pagamentoDebito.cd_associado_pd = associado.id_associado;
            pagamentoDebito.id_banco_pd = params.idBanco;
            pagamentoDebito.nu_agencia = params.agencia;
            pagamentoDebito.nu_conta = params.conta;
            pagamentoDebito.nu_valor = associado.nu_vl_mensalidade;
            pagamentoDebito.ds_vencimento = dataExpiracao.toString();
            pagamentoDebito.nu_OperacaoCEF = params.operacao || 0;
            yield pagamentoDebito.useTransaction(transaction).save();
        });
    }
    removePagamentoDebitoByIdAssociado(associado, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield TbPagamentoDebito_1.default.query()
                .where('cd_associado_pd', associado.id_associado)
                .useTransaction(transaction)
                .delete();
        });
    }
}
exports.default = PagamentoDebitoService;
//# sourceMappingURL=PagamentoDebitoService.js.map