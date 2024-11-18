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
const TbMeioPagamento_1 = __importDefault(require("./TbMeioPagamento"));
const TbProdutoComercial_1 = __importDefault(require("./TbProdutoComercial"));
class TbFormasPagamentoIndividual extends Orm_1.BaseModel {
}
TbFormasPagamentoIndividual.table = 'tb_formaspgtoIF';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], TbFormasPagamentoIndividual.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbFormasPagamentoIndividual.prototype, "vl_valor", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'nu_PagUnico' }),
    __metadata("design:type", Number)
], TbFormasPagamentoIndividual.prototype, "nu_PagUnico", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbFormasPagamentoIndividual.prototype, "id_prodcomerc_if", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'cd_CodContratoS4E' }),
    __metadata("design:type", Number)
], TbFormasPagamentoIndividual.prototype, "cd_CodContratoS4E", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbFormasPagamentoIndividual.prototype, "id_meiopagto_if", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => TbProdutoComercial_1.default, {
        foreignKey: 'id_prodcomerc_if'
    }),
    __metadata("design:type", Object)
], TbFormasPagamentoIndividual.prototype, "produtoComercial", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => TbMeioPagamento_1.default, {
        foreignKey: 'id_meiopagto_if'
    }),
    __metadata("design:type", Object)
], TbFormasPagamentoIndividual.prototype, "meioPagamentoIndividual", void 0);
exports.default = TbFormasPagamentoIndividual;
//# sourceMappingURL=TbFormasPagamentoIndividual.js.map