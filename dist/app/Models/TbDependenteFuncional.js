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
class TbDependenteFuncional extends Orm_1.BaseModel {
}
TbDependenteFuncional.table = 'tb_dependente_funcional';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], TbDependenteFuncional.prototype, "id_dependente", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbDependenteFuncional.prototype, "id_funcionario_df", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbDependenteFuncional.prototype, "nm_dependente", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbDependenteFuncional.prototype, "nu_cpf", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbDependenteFuncional.prototype, "nu_rg", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbDependenteFuncional.prototype, "ds_orgao_expedidor", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbDependenteFuncional.prototype, "nu_cns", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbDependenteFuncional.prototype, "dt_nasc", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbDependenteFuncional.prototype, "nm_mae", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbDependenteFuncional.prototype, "id_sexo_df", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbDependenteFuncional.prototype, "id_parentesco_df", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbDependenteFuncional.prototype, "id_prodcomerc_df", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbDependenteFuncional.prototype, "vl_valor", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbDependenteFuncional.prototype, "ds_email", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbDependenteFuncional.prototype, "documento_vinculo", void 0);
exports.default = TbDependenteFuncional;
//# sourceMappingURL=TbDependenteFuncional.js.map