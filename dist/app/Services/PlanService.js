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
const PlanoNaoEncontrado_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/PlanoNaoEncontrado"));
const TbParceiro_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbParceiro"));
class PlanService {
    getPlanWithTokenIndividual(sigla, idCategoria, token) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const parceiro = yield TbParceiro_1.default
                .query()
                .preload('produtoComercial', (query) => {
                query.preload('formasPagamentoIndividual');
            })
                .leftJoin('tb_tokenidparc', 'tb_tokenidparc.nu_IdParceiro_tk', 'tb_parceiro.id_parceiro')
                .innerJoin('tb_ProdutoComercial', 'tb_ProdutoComercial.id_prodcomerc', 'tb_parceiro.id_prodcomerc_pr')
                .innerJoin('tb_ModProduto', 'tb_ModProduto.id_modproduto', 'tb_ProdutoComercial.id_modproduto_c')
                .leftJoin('tb_AbrangRegiao', 'tb_AbrangRegiao.id_prodcomerc_abr', 'tb_ProdutoComercial.id_prodcomerc')
                .innerJoin('tb_categoria', 'tb_categoria.id_categoria', 'tb_ProdutoComercial.id_categoria_c')
                .leftJoin('tb_TipoPreco', 'tb_TipoPreco.id_TipoPreco', 'tb_ProdutoComercial.id_TipoPreco_c')
                .leftJoin('tb_formaspgtoIF', 'tb_formaspgtoIF.id_prodcomerc_if', 'tb_ProdutoComercial.id_prodcomerc')
                .innerJoin('tb_UF', 'tb_AbrangRegiao.id_uf_r', 'tb_UF.id_uf')
                .where('tb_ProdutoComercial.nu_PublicaInt', 1)
                .where('tb_ProdutoComercial.en_status', 1)
                .where('tb_UF.sigla', sigla)
                .whereIn('tb_categoria.id_categoria', idCategoria)
                .where('tb_tokenidparc.cd_Codtokenidparc', token)
                .orderBy('tb_formaspgtoIF.vl_valor', 'asc')
                .distinct()
                .first();
            if (!((_a = parceiro === null || parceiro === void 0 ? void 0 : parceiro.produtoComercial.formasPagamentoIndividual[0]) === null || _a === void 0 ? void 0 : _a.vl_valor)) {
                throw new PlanoNaoEncontrado_1.default();
            }
            return parceiro;
        });
    }
    getBasicPlanIndividual(sigla, idCategoria) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield TbParceiro_1.default
                .query()
                .preload('produtoComercial', (query) => {
                query.preload('formasPagamentoIndividual');
            })
                .leftJoin('tb_tokenidparc', 'tb_tokenidparc.nu_IdParceiro_tk', 'tb_parceiro.id_parceiro')
                .innerJoin('tb_ProdutoComercial', 'tb_ProdutoComercial.id_prodcomerc', 'tb_parceiro.id_prodcomerc_pr')
                .innerJoin('tb_ModProduto', 'tb_ModProduto.id_modproduto', 'tb_ProdutoComercial.id_modproduto_c')
                .leftJoin('tb_AbrangRegiao', 'tb_AbrangRegiao.id_prodcomerc_abr', 'tb_ProdutoComercial.id_prodcomerc')
                .innerJoin('tb_categoria', 'tb_categoria.id_categoria', 'tb_ProdutoComercial.id_categoria_c')
                .leftJoin('tb_TipoPreco', 'tb_TipoPreco.id_TipoPreco', 'tb_ProdutoComercial.id_TipoPreco_c')
                .leftJoin('tb_formaspgtoIF', 'tb_formaspgtoIF.id_prodcomerc_if', 'tb_ProdutoComercial.id_prodcomerc')
                .innerJoin('tb_UF', 'tb_AbrangRegiao.id_uf_r', 'tb_UF.id_uf')
                .where('tb_ProdutoComercial.nu_PublicaInt', 1)
                .where('tb_ProdutoComercial.en_status', 1)
                .where('tb_UF.sigla', sigla)
                .whereIn('tb_categoria.id_categoria', idCategoria)
                .where('tb_ProdutoComercial.en_SitCarencia', 0)
                .where('nu_cdVendedor4E_tk', 0)
                .where('nu_cdCorretoraS4E_tk', 0)
                .orderBy('tb_formaspgtoIF.vl_valor', 'asc')
                .distinct()
                .first()) || new TbParceiro_1.default;
        });
    }
    getPlanWithTokenCompany(sigla, token, idsCategoria) {
        return __awaiter(this, void 0, void 0, function* () {
            const parceiro = yield TbParceiro_1.default
                .query()
                .preload('produtoComercial', (query) => {
                query.preload('formasPagamentoEmpresa');
            })
                .leftJoin('tb_tokenidparc', 'tb_tokenidparc.nu_IdParceiro_tk', 'tb_parceiro.id_parceiro')
                .innerJoin('tb_ProdutoComercial', 'tb_ProdutoComercial.id_prodcomerc', 'tb_parceiro.id_prodcomerc_pr')
                .innerJoin('tb_ModProduto', 'tb_ModProduto.id_modproduto', 'tb_ProdutoComercial.id_modproduto_c')
                .leftJoin('tb_AbrangRegiao', 'tb_AbrangRegiao.id_prodcomerc_abr', 'tb_ProdutoComercial.id_prodcomerc')
                .innerJoin('tb_categoria', 'tb_categoria.id_categoria', 'tb_ProdutoComercial.id_categoria_c')
                .leftJoin('tb_TipoPreco', 'tb_TipoPreco.id_TipoPreco', 'tb_ProdutoComercial.id_TipoPreco_c')
                .leftJoin('tb_formaspgtoCol', 'tb_formaspgtoCol.id_prodcomerc_fc', 'tb_ProdutoComercial.id_prodcomerc')
                .innerJoin('tb_UF', 'tb_AbrangRegiao.id_uf_r', 'tb_UF.id_uf')
                .where('tb_ProdutoComercial.nu_PublicaInt', 1)
                .where('tb_ProdutoComercial.en_status', 1)
                .where('tb_UF.sigla', sigla)
                .whereIn('tb_categoria.id_categoria', idsCategoria)
                .where('tb_tokenidparc.cd_Codtokenidparc', token)
                .orderBy('tb_formaspgtoCol.vl_valor', 'asc')
                .distinct()
                .first();
            if (!(parceiro === null || parceiro === void 0 ? void 0 : parceiro.produtoComercial.formasPagamentoEmpresa[0].vl_valor)) {
                throw new PlanoNaoEncontrado_1.default();
            }
            return parceiro;
        });
    }
    getBasicPlanCompany(sigla, idsCategoria) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield TbParceiro_1.default
                .query()
                .preload('produtoComercial', (query) => {
                query.preload('formasPagamentoEmpresa');
            })
                .leftJoin('tb_tokenidparc', 'tb_tokenidparc.nu_IdParceiro_tk', 'tb_parceiro.id_parceiro')
                .innerJoin('tb_ProdutoComercial', 'tb_ProdutoComercial.id_prodcomerc', 'tb_parceiro.id_prodcomerc_pr')
                .innerJoin('tb_ModProduto', 'tb_ModProduto.id_modproduto', 'tb_ProdutoComercial.id_modproduto_c')
                .leftJoin('tb_AbrangRegiao', 'tb_AbrangRegiao.id_prodcomerc_abr', 'tb_ProdutoComercial.id_prodcomerc')
                .innerJoin('tb_categoria', 'tb_categoria.id_categoria', 'tb_ProdutoComercial.id_categoria_c')
                .leftJoin('tb_TipoPreco', 'tb_TipoPreco.id_TipoPreco', 'tb_ProdutoComercial.id_TipoPreco_c')
                .leftJoin('tb_formaspgtoCol', 'tb_formaspgtoCol.id_prodcomerc_fc', 'tb_ProdutoComercial.id_prodcomerc')
                .innerJoin('tb_UF', 'tb_AbrangRegiao.id_uf_r', 'tb_UF.id_uf')
                .where('tb_ProdutoComercial.nu_PublicaInt', 1)
                .where('tb_ProdutoComercial.en_status', 1)
                .where('tb_UF.sigla', sigla)
                .whereIn('tb_categoria.id_categoria', idsCategoria)
                .where('tb_ProdutoComercial.en_SitCarencia', 0)
                .where('nu_cdVendedor4E_tk', 0)
                .where('nu_cdCorretoraS4E_tk', 0)
                .orderBy('tb_formaspgtoCol.vl_valor', 'asc')
                .distinct()
                .first()) || new TbParceiro_1.default;
        });
    }
}
exports.default = PlanService;
//# sourceMappingURL=PlanService.js.map