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
Object.defineProperty(exports, "__esModule", { value: true });
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
class TbPagamentoCartao extends Orm_1.BaseModel {
}
TbPagamentoCartao.table = 'tb_pgtocartao';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], TbPagamentoCartao.prototype, "id_pgtocartao", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "cd_associado_pc" }),
    __metadata("design:type", Number)
], TbPagamentoCartao.prototype, "cd_associado_pc", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tid" }),
    __metadata("design:type", String)
], TbPagamentoCartao.prototype, "tid", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "dt_cadastro" }),
    __metadata("design:type", String)
], TbPagamentoCartao.prototype, "dt_cadastro", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "mensagem" }),
    __metadata("design:type", String)
], TbPagamentoCartao.prototype, "mensagem", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "bandeira" }),
    __metadata("design:type", String)
], TbPagamentoCartao.prototype, "bandeira", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "parcela" }),
    __metadata("design:type", Number)
], TbPagamentoCartao.prototype, "parcela", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nu_numcartao" }),
    __metadata("design:type", String)
], TbPagamentoCartao.prototype, "nu_numcartao", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "cod_autorizacao" }),
    __metadata("design:type", String)
], TbPagamentoCartao.prototype, "cod_autorizacao", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nu_mesvalidade" }),
    __metadata("design:type", String)
], TbPagamentoCartao.prototype, "nu_mesvalidade", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nu_anovalidade" }),
    __metadata("design:type", String)
], TbPagamentoCartao.prototype, "nu_anovalidade", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "vl_valor" }),
    __metadata("design:type", Number)
], TbPagamentoCartao.prototype, "vl_valor", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nu_cvv" }),
    __metadata("design:type", String)
], TbPagamentoCartao.prototype, "nu_cvv", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nu_stattransacao" }),
    __metadata("design:type", Number)
], TbPagamentoCartao.prototype, "nu_stattransacao", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "codigoRetorno" }),
    __metadata("design:type", String)
], TbPagamentoCartao.prototype, "codigoRetorno", void 0);
exports.default = TbPagamentoCartao;
//# sourceMappingURL=TbPagamentoCartao.js.map