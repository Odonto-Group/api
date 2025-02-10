"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const fold_1 = require("@adonisjs/fold");
const Category_1 = global[Symbol.for('ioc.use')]("App/Enums/Category");
const PlanService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/PlanService"));
const TokenService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/TokenService"));
const CarenciaProdutoService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/CarenciaProdutoService"));
const luxon_1 = require("luxon");
const TbOrgao_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbOrgao"));
const TbFontePagadora_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbFontePagadora"));
const TbPerfilServidor_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbPerfilServidor"));
const TbUf_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbUf"));
const TbSexo_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbSexo"));
const TbBanco_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbBanco"));
const TbParentesco_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbParentesco"));
const TbEstadoCivil_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbEstadoCivil"));
const TbOrgaoExpedidor_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbOrgaoExpedidor"));
const TokenInvalidoException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/TokenInvalidoException"));
const UfService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/UfService"));
const UfInvalidoException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/UfInvalidoException"));
const VendedorNaoEncontradoException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/VendedorNaoEncontradoException"));
let IndividualPlanController = class IndividualPlanController {
    constructor(planService, tokenService, carenciaProdutoService, ufService) {
        this.planService = planService;
        this.tokenService = tokenService;
        this.carenciaProdutoService = carenciaProdutoService;
        this.ufService = ufService;
    }
    index({ params }) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = params.token;
            const state = params.state;
            yield this.validaToken(token);
            if (state && (yield this.ufService.isUFValido(state))) {
                throw new UfInvalidoException_1.default();
            }
            let plan;
            if (token) {
                plan = yield this.planService.getPlanWithTokenIndividual(state, [Category_1.Category.PESSOA_FISICA], token);
            }
            else {
                plan = yield this.planService.getBasicPlanIndividual(state, [Category_1.Category.PESSOA_FISICA]);
            }
            return {
                valor: plan.produtoComercial.formasPagamentoIndividual[0].vl_valor
            };
        });
    }
    getPlanDetails({ request }) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const token = request.params().token;
            yield this.validaToken(token);
            const tokenBanco = yield this.tokenService.findTokenParceiroIndividual(token);
            const carencias = yield this.carenciaProdutoService.buscarCarencia(tokenBanco.parceiro.produtoComercial.id_prodcomerc);
            if (tokenBanco.vendedor === null) {
                throw new VendedorNaoEncontradoException_1.default();
            }
            let liste = [];
            let arrGeral = [];
            let formasPagamento = {};
            tokenBanco.parceiro.produtoComercial.formasPagamentoIndividual.forEach(pagamento => {
                var _a;
                let cdMeioPagto = pagamento.meioPagamentoIndividual.cd_gmeiopagto;
                let pag = {};
                let arrayPag = [];
                if (formasPagamento.cdMeioPagto == null) {
                    switch (cdMeioPagto) {
                        case 1:
                            pag.nome = "Cartão de Crédito";
                            pag.slug = "pgtoCartao";
                            pag.meioPagamaneto = pagamento.id_meiopagto_if;
                            arrayPag[pagamento.id_meiopagto_if] = { vl_fp: pagamento.vl_valor };
                            break;
                        case 2:
                            pag.nome = "Débito em conta";
                            pag.slug = "pgtoDebito";
                            pag.meioPagamaneto = pagamento.id_meiopagto_if;
                            arrayPag[pagamento.id_meiopagto_if] = { vl_fp: pagamento.vl_valor };
                            break;
                        case 3:
                            if (pagamento.nu_PagUnico == 0) {
                                pag.nome = "Boleto Bancário";
                                pag.slug = "pgtoBoleto";
                                pag.meioPagamaneto = pagamento.id_meiopagto_if;
                                pag.vl_valor = pagamento.vl_valor;
                                arrayPag[pagamento.id_meiopagto_if] = { vl_fp: pagamento.vl_valor };
                            }
                            else {
                                pag.nome = "Boleto Bancário";
                                pag.slug = "pgtoBoleto";
                                pag.meioPagamaneto = pagamento.id_meiopagto_if;
                                pag.valorCheio = pagamento.vl_valor * 12;
                                arrayPag[pagamento.id_meiopagto_if] = { vl_fp: pagamento.vl_valor };
                            }
                            break;
                        case 4:
                            pag.nome = "Consignado";
                            pag.slug = "pgtoConsignado";
                            pag.meioPagamaneto = pagamento.id_meiopagto_if;
                            const dia = luxon_1.DateTime.now().day;
                            if (dia < 5) {
                                pag.data_vigencia_final = luxon_1.DateTime.now().set({ day: 1 }).toFormat('yyyy/MM/dd');
                            }
                            else {
                                const currentDate = luxon_1.DateTime.local();
                                const nextMonthDate = currentDate.plus({ months: 1 }).startOf('month');
                                pag.data_vigencia_final = nextMonthDate.toFormat('yyyy/MM/dd');
                            }
                            break;
                        case 5:
                            pag.nome = "Fatura";
                            pag.slug = "pgtoFatura";
                            pag.meioPagamaneto = pagamento.id_meiopagto_if;
                            break;
                        default:
                            pag.nome = "";
                            pag.slug = "";
                            pag.meioPagamaneto = "";
                            break;
                    }
                    formasPagamento[cdMeioPagto || 0] = {
                        'idPgto': pag.meioPagamaneto,
                        'gmeioPagto': cdMeioPagto,
                        'nm_forma': pag.nome,
                        'valor': pag.valorCheio || pag.vl_valor,
                        'slug': pag.slug,
                        'dataVigenciaFinal': (_a = pag.data_vigencia_final) !== null && _a !== void 0 ? _a : null
                    };
                }
            });
            let equipe;
            let agencia;
            let promotor;
            let angariador;
            const produtoComercial = tokenBanco.parceiro.produtoComercial;
            let confirma = false;
            let orgaos = [];
            let perfils = [];
            let fontePagadora = [];
            if (tokenBanco.parceiro.produtoComercial.categoria.id_categoria != 2) {
                orgaos = yield TbOrgao_1.default.query();
                perfils = yield TbPerfilServidor_1.default.query();
                fontePagadora = yield TbFontePagadora_1.default.query();
            }
            let ufs = [];
            let listaSexos = [];
            let listaBancos = [];
            let listaParentesco = [];
            let listaEstadoCivil = [];
            let listaOrgaoExpedidor = [];
            yield Promise.all([
                TbUf_1.default.query(),
                TbSexo_1.default.query(),
                TbBanco_1.default.query()
                    .where('nu_statusbco', 1),
                TbParentesco_1.default.query()
                    .where('nu_UsoTipoPlan', 2)
                    .where("nm_siglagraupar", "!=", "TITULAR"),
                TbEstadoCivil_1.default.query(),
                TbOrgaoExpedidor_1.default.query()
            ])
                .then(results => {
                ufs = results[0];
                listaSexos = results[1];
                listaBancos = results[2];
                listaParentesco = results[3];
                listaEstadoCivil = results[4];
                listaOrgaoExpedidor = results[5];
            });
            let dataVencimento = this.criarDataVencimento();
            return {
                type: 'individual',
                produtoComercial: produtoComercial,
                vendedor: (_a = tokenBanco === null || tokenBanco === void 0 ? void 0 : tokenBanco.vendedor) === null || _a === void 0 ? void 0 : _a.tx_nome,
                corretora: tokenBanco.corretora,
                parceiro: tokenBanco.parceiro,
                formasPagamento: tokenBanco.parceiro.produtoComercial.formasPagamentoIndividual,
                listaFormaPagamentos: formasPagamento,
                equipes: equipe,
                angariadores: angariador,
                promotores: promotor,
                agencias: agencia,
                categoria: tokenBanco.parceiro.produtoComercial.categoria,
                listaUFS: ufs,
                vendedorPN: (_c = (_b = tokenBanco === null || tokenBanco === void 0 ? void 0 : tokenBanco.vendedor) === null || _b === void 0 ? void 0 : _b.tx_nome) === null || _c === void 0 ? void 0 : _c.split(" ")[0],
                listaOrgaosExpedidor: listaOrgaoExpedidor,
                listaSexos: listaSexos,
                listaEstadosCivil: listaEstadoCivil,
                orgaos: orgaos,
                perfis: perfils,
                fontePagamentos: fontePagadora,
                listaParentescos: listaParentesco,
                token: token,
                listaEspec: liste,
                arrGeral: arrGeral,
                vencimentoBoletos: dataVencimento,
                bancos: listaBancos,
                carencias: carencias
            };
        });
    }
    criarDataVencimento() {
        let datas = [];
        let todayIm = luxon_1.DateTime.local().toFormat('yyyy-MM-dd');
        let nextValue = luxon_1.DateTime.local().plus({ days: 4 }).toFormat('yyyy-MM-dd');
        let month = luxon_1.DateTime.local().month;
        let year = luxon_1.DateTime.local().year;
        let i = 0;
        let dia = 5;
        do {
            let dtValue = luxon_1.DateTime.local(year, month, dia).toFormat('yyyy-MM-dd');
            let dtSelect = luxon_1.DateTime.local(year, month, dia).toFormat('yyyy/MM/dd');
            datas[i] = { value: dtValue, select: dtSelect };
            dia += 5;
            i++;
        } while (dia < 30);
        dia = 5;
        do {
            let dtValue = luxon_1.DateTime.local(year, month, dia).plus({ months: 1 }).toFormat('yyyy-MM-dd');
            let dtSelect = luxon_1.DateTime.local(year, month, dia).plus({ months: 1 }).toFormat('yyyy/MM/dd');
            datas[i] = { value: dtValue, select: dtSelect };
            dia += 5;
            i++;
        } while (dia < 30);
        let expiryDates = datas.filter(data => data.value > todayIm && data.value > nextValue).slice(0, 3);
        return expiryDates;
    }
    extrairNomesVendedor(nomeCompletoVendedor) {
        let vendedorNomes = nomeCompletoVendedor.split(" ");
        return {
            vendedorNome: vendedorNomes,
            vendedorPN: vendedorNomes[0]
        };
    }
    validaToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (token && !(yield this.tokenService.isTokenValido(token))) {
                throw new TokenInvalidoException_1.default();
            }
        });
    }
};
IndividualPlanController = __decorate([
    (0, fold_1.inject)(),
    __metadata("design:paramtypes", [PlanService_1.default,
        TokenService_1.default,
        CarenciaProdutoService_1.default,
        UfService_1.default])
], IndividualPlanController);
exports.default = IndividualPlanController;
//# sourceMappingURL=IndividualPlanController.js.map