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
const GrupoPagamento_1 = global[Symbol.for('ioc.use')]("App/Enums/GrupoPagamento");
const TbFormasPagamentoEmpresa_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbFormasPagamentoEmpresa"));
const TbFormasPagamentoIndividual_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbFormasPagamentoIndividual"));
class FormasPagamentoService {
    findFormaPagamentoIndividual(idProdutoComercial, idBanco, formaPagamento) {
        return __awaiter(this, void 0, void 0, function* () {
            if (formaPagamento.gpPagto == GrupoPagamento_1.GrupoPagamento.DEBITO_EM_CONTA) {
                return yield TbFormasPagamentoIndividual_1.default
                    .query()
                    .preload('produtoComercial')
                    .innerJoin('tb_ProdutoComercial', 'tb_ProdutoComercial.id_prodcomerc', 'tb_formaspgtoIF.id_prodcomerc_if')
                    .innerJoin('tb_formabco', 'tb_formabco.id_formaspgtoIF_fb', 'tb_formaspgtoIF.id_formaspgtoIF')
                    .innerJoin('tb_banco', 'tb_banco.id_banco', 'tb_formabco.id_banco_fb')
                    .where('tb_formaspgtoIF.id_prodcomerc_if', idProdutoComercial)
                    .where('tb_banco.id_banco', idBanco)
                    .first();
            }
            else {
                return yield TbFormasPagamentoIndividual_1.default
                    .query()
                    .preload('produtoComercial')
                    .innerJoin('tb_ProdutoComercial', 'tb_ProdutoComercial.id_prodcomerc', 'tb_formaspgtoIF.id_prodcomerc_if')
                    .where('tb_formaspgtoIF.id_prodcomerc_if', idProdutoComercial)
                    .where('tb_formaspgtoIF.id_meiopagto_if', formaPagamento.idPagto)
                    .first();
            }
        });
    }
    findFormaPagamentoEmpresa(idProdutoComercial) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield TbFormasPagamentoEmpresa_1.default
                .query()
                .preload('produtoComercial')
                .innerJoin('tb_ProdutoComercial', 'tb_ProdutoComercial.id_prodcomerc', 'tb_formaspgtoCol.id_prodcomerc_fc')
                .where('tb_formaspgtoCol.id_prodcomerc_fc', idProdutoComercial)
                .where('tb_formaspgtoCol.id_meiopagto_fc', 14)
                .first();
        });
    }
}
exports.default = FormasPagamentoService;
//# sourceMappingURL=FormasPagamentoService.js.map