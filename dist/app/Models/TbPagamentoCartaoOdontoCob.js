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
class TbPagamentoCartaoOdontoCob extends Orm_1.BaseModel {
}
TbPagamentoCartaoOdontoCob.table = 'tb_pgtocartaoOdontocob';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], TbPagamentoCartaoOdontoCob.prototype, "id_pgtocartao_odonto", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbPagamentoCartaoOdontoCob.prototype, "cd_associado_pco", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbPagamentoCartaoOdontoCob.prototype, "tx_token", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbPagamentoCartaoOdontoCob.prototype, "vl_valor", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbPagamentoCartaoOdontoCob.prototype, "dt_cadastro", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbPagamentoCartaoOdontoCob.prototype, "dt_vencimento", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbPagamentoCartaoOdontoCob.prototype, "nr_proposta", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbPagamentoCartaoOdontoCob.prototype, "dt_pagamento", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "pagamentoId" }),
    __metadata("design:type", String)
], TbPagamentoCartaoOdontoCob.prototype, "pagamentoId", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbPagamentoCartaoOdontoCob.prototype, "nsu", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "autorizacaoCodigo" }),
    __metadata("design:type", String)
], TbPagamentoCartaoOdontoCob.prototype, "autorizacaoCodigo", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "cartaoId" }),
    __metadata("design:type", String)
], TbPagamentoCartaoOdontoCob.prototype, "cartaoId", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "blAtivo" }),
    __metadata("design:type", Number)
], TbPagamentoCartaoOdontoCob.prototype, "blAtivo", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "linkPgto" }),
    __metadata("design:type", String)
], TbPagamentoCartaoOdontoCob.prototype, "linkPgto", void 0);
exports.default = TbPagamentoCartaoOdontoCob;
//# sourceMappingURL=TbPagamentoCartaoOdontoCob.js.map