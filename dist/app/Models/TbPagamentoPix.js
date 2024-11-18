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
class TbPagamentoPix extends Orm_1.BaseModel {
}
TbPagamentoPix.table = 'tb_pgtopix';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], TbPagamentoPix.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "cd_associado" }),
    __metadata("design:type", Number)
], TbPagamentoPix.prototype, "cd_associado", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "id_pix_odontocob" }),
    __metadata("design:type", String)
], TbPagamentoPix.prototype, "id_pix_odontocob", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "dt_cadastro" }),
    __metadata("design:type", String)
], TbPagamentoPix.prototype, "dt_cadastro", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "dt_vencimento" }),
    __metadata("design:type", String)
], TbPagamentoPix.prototype, "dt_vencimento", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbPagamentoPix.prototype, "valor", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "dt_pagamento" }),
    __metadata("design:type", String)
], TbPagamentoPix.prototype, "dt_pagamento", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], TbPagamentoPix.prototype, "ativo", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "updated_at" }),
    __metadata("design:type", String)
], TbPagamentoPix.prototype, "updated_at", void 0);
exports.default = TbPagamentoPix;
//# sourceMappingURL=TbPagamentoPix.js.map