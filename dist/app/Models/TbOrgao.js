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
class TbOrgao extends Orm_1.BaseModel {
}
TbOrgao.table = 'tb_orgao';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], TbOrgao.prototype, "id_orgao", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'id_Fontepag_o' }),
    __metadata("design:type", Object)
], TbOrgao.prototype, "id_Fontepag_o", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'nu_CodOrgao' }),
    __metadata("design:type", Object)
], TbOrgao.prototype, "nu_CodOrgao", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'tx_NmFontePagOrgao' }),
    __metadata("design:type", Object)
], TbOrgao.prototype, "tx_NmFontePagOrgao", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'tx_NmOrgao' }),
    __metadata("design:type", Object)
], TbOrgao.prototype, "tx_NmOrgao", void 0);
exports.default = TbOrgao;
//# sourceMappingURL=TbOrgao.js.map