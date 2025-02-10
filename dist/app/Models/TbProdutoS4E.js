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
const TbProdutoComercial_1 = __importDefault(require("./TbProdutoComercial"));
class TbProdutoS4E extends Orm_1.BaseModel {
}
TbProdutoS4E.table = 'tb_ProdAnsS4E';
__decorate([
    (0, Orm_1.column)({ columnName: 'id_ProdutoS4E', isPrimary: true }),
    __metadata("design:type", Number)
], TbProdutoS4E.prototype, "cd_codigo", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'id_AbrangAnsS4E_p' }),
    __metadata("design:type", Number)
], TbProdutoS4E.prototype, "id_AbrangAnsS4E_p", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'nu_CodProdutoS4E' }),
    __metadata("design:type", Number)
], TbProdutoS4E.prototype, "nu_CodProdutoS4E", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'nm_NomeProdS4E' }),
    __metadata("design:type", String)
], TbProdutoS4E.prototype, "nm_NomeProdS4E", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'nu_CodigoAnsS4E' }),
    __metadata("design:type", Number)
], TbProdutoS4E.prototype, "nu_CodigoAnsS4E", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'nu_CodClassAnsS4E' }),
    __metadata("design:type", String)
], TbProdutoS4E.prototype, "nu_CodClassAnsS4E", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'nm_NomeProdANS' }),
    __metadata("design:type", String)
], TbProdutoS4E.prototype, "nm_NomeProdANS", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'nu_CodClassTpEmp' }),
    __metadata("design:type", Number)
], TbProdutoS4E.prototype, "nu_CodClassTpEmp", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'nm_DscClassTpEmp' }),
    __metadata("design:type", String)
], TbProdutoS4E.prototype, "nm_DscClassTpEmp", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'tx_UFsAbrangencia' }),
    __metadata("design:type", String)
], TbProdutoS4E.prototype, "tx_UFsAbrangencia", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => TbProdutoComercial_1.default),
    __metadata("design:type", Object)
], TbProdutoS4E.prototype, "produtoComercial", void 0);
exports.default = TbProdutoS4E;
//# sourceMappingURL=TbProdutoS4E.js.map