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
class TbPagamentoBoletoOdontoCob extends Orm_1.BaseModel {
}
TbPagamentoBoletoOdontoCob.table = 'tb_pgtoboletoOdontocob';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], TbPagamentoBoletoOdontoCob.prototype, "id_pagtoboleto", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbPagamentoBoletoOdontoCob.prototype, "cd_cliente", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbPagamentoBoletoOdontoCob.prototype, "dt_gerado", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbPagamentoBoletoOdontoCob.prototype, "id_banco_pbo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbPagamentoBoletoOdontoCob.prototype, "nu_idboleto_odontocob", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbPagamentoBoletoOdontoCob.prototype, "nu_valoremissao", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbPagamentoBoletoOdontoCob.prototype, "dt_vencimento", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbPagamentoBoletoOdontoCob.prototype, "dt_emissao", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbPagamentoBoletoOdontoCob.prototype, "dt_pagamento", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbPagamentoBoletoOdontoCob.prototype, "vl_valorpago", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbPagamentoBoletoOdontoCob.prototype, "tx_linkboleto_odontocob", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nu_statusboleto" }),
    __metadata("design:type", Number)
], TbPagamentoBoletoOdontoCob.prototype, "nu_statusboleto", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbPagamentoBoletoOdontoCob.prototype, "nu_unico", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_linhaDigitavel" }),
    __metadata("design:type", String)
], TbPagamentoBoletoOdontoCob.prototype, "tx_linhaDigitavel", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_codigoBarra" }),
    __metadata("design:type", String)
], TbPagamentoBoletoOdontoCob.prototype, "tx_codigoBarra", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbPagamentoBoletoOdontoCob.prototype, "tipo_cliente", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nossoNumero" }),
    __metadata("design:type", String)
], TbPagamentoBoletoOdontoCob.prototype, "nossoNumero", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbPagamentoBoletoOdontoCob.prototype, "nr_proposta", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "blAtivo" }),
    __metadata("design:type", Boolean)
], TbPagamentoBoletoOdontoCob.prototype, "blAtivo", void 0);
exports.default = TbPagamentoBoletoOdontoCob;
//# sourceMappingURL=TbPagamentoBoletoOdontoCob.js.map