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
class TbRespFinanceiro extends Orm_1.BaseModel {
    setCelularAttribute(value) {
        value = value ? value.replace(/\D/g, "") : "00000000000";
        this.nu_dddCelRespFin = value.substring(0, 2);
        this.nu_celRespFin = value.substring(2, 11);
    }
}
TbRespFinanceiro.table = 'tb_RespEmpresa';
__decorate([
    (0, Orm_1.column)({ columnName: 'id_respfinanc' }),
    __metadata("design:type", Number)
], TbRespFinanceiro.prototype, "id_respfinanc", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'id_empresa_rf' }),
    __metadata("design:type", Number)
], TbRespFinanceiro.prototype, "id_empresa_rf", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'nu_CPFRespFin' }),
    __metadata("design:type", String)
], TbRespFinanceiro.prototype, "nu_CPFRespFin", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'nm_RespFinanc' }),
    __metadata("design:type", String)
], TbRespFinanceiro.prototype, "nm_RespFinanc", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'dt_NascRespFin' }),
    __metadata("design:type", String)
], TbRespFinanceiro.prototype, "dt_NascRespFin", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'nu_dddRespFin' }),
    __metadata("design:type", String)
], TbRespFinanceiro.prototype, "nu_dddRespFin", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'nu_telRespFin' }),
    __metadata("design:type", String)
], TbRespFinanceiro.prototype, "nu_telRespFin", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'nu_dddCelRespFin' }),
    __metadata("design:type", String)
], TbRespFinanceiro.prototype, "nu_dddCelRespFin", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'nu_celRespFin' }),
    __metadata("design:type", String)
], TbRespFinanceiro.prototype, "nu_celRespFin", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'nr_proposta' }),
    __metadata("design:type", String)
], TbRespFinanceiro.prototype, "nr_proposta", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'ds_emailRespFin' }),
    __metadata("design:type", String)
], TbRespFinanceiro.prototype, "ds_emailRespFin", void 0);
exports.default = TbRespFinanceiro;
//# sourceMappingURL=TbResponsavelEmpresa.js.map