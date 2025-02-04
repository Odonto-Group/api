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
const TbAssociado_1 = __importDefault(require("./TbAssociado"));
class TbResponsavelFinanceiro extends Orm_1.BaseModel {
    setCelularAttribute(value) {
        value = value ? value.replace(/\D/g, "") : "00000000000";
        this.nu_dddRespFin = value.substring(0, 2);
        this.nu_telRespFin = value.substring(2, 11);
    }
}
TbResponsavelFinanceiro.table = 'tb_RespFinanc';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], TbResponsavelFinanceiro.prototype, "id_respfinanc", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nu_CPFRespFin" }),
    __metadata("design:type", String)
], TbResponsavelFinanceiro.prototype, "nu_CPFRespFin", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nm_RespFinanc" }),
    __metadata("design:type", String)
], TbResponsavelFinanceiro.prototype, "nm_RespFinanc", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "dt_NascRespFin" }),
    __metadata("design:type", String)
], TbResponsavelFinanceiro.prototype, "dt_NascRespFin", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "ds_emailRespFin" }),
    __metadata("design:type", String)
], TbResponsavelFinanceiro.prototype, "ds_emailRespFin", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nu_CEP" }),
    __metadata("design:type", String)
], TbResponsavelFinanceiro.prototype, "nu_CEP", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_EndLograd" }),
    __metadata("design:type", String)
], TbResponsavelFinanceiro.prototype, "tx_EndLograd", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_EndNumero" }),
    __metadata("design:type", String)
], TbResponsavelFinanceiro.prototype, "tx_EndNumero", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_EndCompl" }),
    __metadata("design:type", String)
], TbResponsavelFinanceiro.prototype, "tx_EndCompl", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_EndBairro" }),
    __metadata("design:type", String)
], TbResponsavelFinanceiro.prototype, "tx_EndBairro", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_EndCidade" }),
    __metadata("design:type", String)
], TbResponsavelFinanceiro.prototype, "tx_EndCidade", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbResponsavelFinanceiro.prototype, "id_uf_rf", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nu_dddRespFin" }),
    __metadata("design:type", String)
], TbResponsavelFinanceiro.prototype, "nu_dddRespFin", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nu_telRespFin" }),
    __metadata("design:type", String)
], TbResponsavelFinanceiro.prototype, "nu_telRespFin", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbResponsavelFinanceiro.prototype, "id_associado_rf", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => TbAssociado_1.default, {
        foreignKey: 'id_associado_rf'
    }),
    __metadata("design:type", Object)
], TbResponsavelFinanceiro.prototype, "associado", void 0);
exports.default = TbResponsavelFinanceiro;
//# sourceMappingURL=TbResponsavelFinanceiro.js.map