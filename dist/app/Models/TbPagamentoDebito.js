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
class TbPagamentoDebito extends Orm_1.BaseModel {
    constructor() {
        super(...arguments);
        this.nu_OperacaoCEF = '0';
    }
}
TbPagamentoDebito.table = 'tb_pgtodebito';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], TbPagamentoDebito.prototype, "id_pagtodebito", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbPagamentoDebito.prototype, "cd_associado_pd", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbPagamentoDebito.prototype, "id_banco_pd", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbPagamentoDebito.prototype, "nu_agencia", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbPagamentoDebito.prototype, "nu_conta", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbPagamentoDebito.prototype, "nu_valor", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbPagamentoDebito.prototype, "ds_vencimento", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nu_OperacaoCEF" }),
    __metadata("design:type", String)
], TbPagamentoDebito.prototype, "nu_OperacaoCEF", void 0);
exports.default = TbPagamentoDebito;
//# sourceMappingURL=TbPagamentoDebito.js.map