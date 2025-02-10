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
const TbTokenIdParc_1 = __importDefault(require("./TbTokenIdParc"));
const TbProdutoComercial_1 = __importDefault(require("./TbProdutoComercial"));
class TbParceiro extends Orm_1.BaseModel {
}
TbParceiro.table = 'tb_parceiro';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], TbParceiro.prototype, "id_parceiro", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbParceiro.prototype, "nm_prodcomerc", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], TbParceiro.prototype, "dataInicioCorte", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], TbParceiro.prototype, "dataFimCorte", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbParceiro.prototype, "en_status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbParceiro.prototype, "id_modproduto_c", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbParceiro.prototype, "nu_PublicaInt", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbParceiro.prototype, "id_ProdutoS4E_c", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], TbParceiro.prototype, "nu_CodDeptoEmpS4E", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], TbParceiro.prototype, "nm_NmDeptoEmpS4E", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbParceiro.prototype, "en_responsavel", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], TbParceiro.prototype, "en_familia", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], TbParceiro.prototype, "en_especial", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbParceiro.prototype, "id_categoria_c", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbParceiro.prototype, "id_TipoPreco_c", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], TbParceiro.prototype, "ativa_img", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbParceiro.prototype, "HabilitaUpDoc", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "en_SitCarencia" }),
    __metadata("design:type", Object)
], TbParceiro.prototype, "en_SitCarencia", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'id_prodcomerc_pr' }),
    __metadata("design:type", Number)
], TbParceiro.prototype, "id_prodcomerc_pr", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => TbProdutoComercial_1.default, {
        foreignKey: "id_prodcomerc_pr"
    }),
    __metadata("design:type", Object)
], TbParceiro.prototype, "produtoComercial", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => TbTokenIdParc_1.default),
    __metadata("design:type", Object)
], TbParceiro.prototype, "tokenidparc", void 0);
exports.default = TbParceiro;
//# sourceMappingURL=TbParceiro.js.map