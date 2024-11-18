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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const TbAbrangeRegiao_1 = __importDefault(require("./TbAbrangeRegiao"));
const TbCategoria_1 = __importDefault(require("./TbCategoria"));
const TbFormasPagamentoIndividual_1 = __importDefault(require("./TbFormasPagamentoIndividual"));
const TbModProduto_1 = __importDefault(require("./TbModProduto"));
const TbTipoPreco_1 = __importDefault(require("./TbTipoPreco"));
const TbParceiro_1 = __importDefault(require("./TbParceiro"));
const TbEmpresa_1 = __importDefault(require("./TbEmpresa"));
const TbFormasPagamentoEmpresa_1 = __importDefault(require("./TbFormasPagamentoEmpresa"));
const TbProdutoS4E_1 = __importDefault(require("./TbProdutoS4E"));
class TbProdutoComercial extends Orm_1.BaseModel {
}
TbProdutoComercial.table = 'tb_ProdutoComercial';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], TbProdutoComercial.prototype, "id_prodcomerc", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'nm_prodcomerc' }),
    __metadata("design:type", String)
], TbProdutoComercial.prototype, "nm_prodcomerc", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbProdutoComercial.prototype, "dataInicioCorte", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbProdutoComercial.prototype, "dataFimCorte", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbProdutoComercial.prototype, "en_status", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'id_modproduto_c' }),
    __metadata("design:type", Number)
], TbProdutoComercial.prototype, "id_modproduto_c", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbProdutoComercial.prototype, "nu_PublicaInt", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'id_ProdutoS4E_c' }),
    __metadata("design:type", Number)
], TbProdutoComercial.prototype, "id_ProdutoS4E_c", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbProdutoComercial.prototype, "nu_CodDeptoEmpS4E", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbProdutoComercial.prototype, "nm_NmDeptoEmpS4E", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbProdutoComercial.prototype, "en_responsavel", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbProdutoComercial.prototype, "en_familia", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbProdutoComercial.prototype, "en_especial", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'id_categoria_c' }),
    __metadata("design:type", Number)
], TbProdutoComercial.prototype, "id_categoria_c", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'id_TipoPreco_c' }),
    __metadata("design:type", Number)
], TbProdutoComercial.prototype, "id_TipoPreco_c", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], TbProdutoComercial.prototype, "ativa_img", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'HabilitaUpDoc' }),
    __metadata("design:type", Number)
], TbProdutoComercial.prototype, "HabilitaUpDoc", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'en_SitCarencia' }),
    __metadata("design:type", Boolean)
], TbProdutoComercial.prototype, "en_SitCarencia", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => TbParceiro_1.default),
    __metadata("design:type", Object)
], TbProdutoComercial.prototype, "parceiro", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => TbEmpresa_1.default),
    __metadata("design:type", Object)
], TbProdutoComercial.prototype, "empresa", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => TbModProduto_1.default, {
        foreignKey: 'id_modproduto_c',
    }),
    __metadata("design:type", Object)
], TbProdutoComercial.prototype, "modalidade", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => TbAbrangeRegiao_1.default, {
        foreignKey: 'id_prodcomerc_abr',
    }),
    __metadata("design:type", Object)
], TbProdutoComercial.prototype, "abrangeRegiao", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => TbCategoria_1.default, {
        foreignKey: 'id_categoria_c',
    }),
    __metadata("design:type", Object)
], TbProdutoComercial.prototype, "categoria", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => TbTipoPreco_1.default, {
        foreignKey: 'id_TipoPreco_c',
    }),
    __metadata("design:type", Object)
], TbProdutoComercial.prototype, "tipoPreco", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => TbFormasPagamentoIndividual_1.default, {
        foreignKey: 'id_prodcomerc_if',
    }),
    __metadata("design:type", Object)
], TbProdutoComercial.prototype, "formasPagamentoIndividual", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => TbFormasPagamentoEmpresa_1.default, {
        foreignKey: 'id_prodcomerc_fc',
    }),
    __metadata("design:type", Object)
], TbProdutoComercial.prototype, "formasPagamentoEmpresa", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => TbProdutoS4E_1.default, {
        foreignKey: 'id_ProdutoS4E_c'
    }),
    __metadata("design:type", Object)
], TbProdutoComercial.prototype, "produtoS4E", void 0);
exports.default = TbProdutoComercial;
//# sourceMappingURL=TbProdutoComercial.js.map