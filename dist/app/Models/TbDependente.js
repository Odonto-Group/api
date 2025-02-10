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
class Dependente extends Orm_1.BaseModel {
    setOrgaoExpedidor(orgaoExpedidor, uf) {
        this.ds_orgao_expedidor = orgaoExpedidor + '-' + uf;
    }
}
Dependente.table = 'tb_dependente';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Dependente.prototype, "id_dependente", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Dependente.prototype, "nm_dependente", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Dependente.prototype, "nu_cpf", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Dependente.prototype, "nu_rg", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Dependente.prototype, "ds_orgao_expedidor", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Dependente.prototype, "nu_cns", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Dependente.prototype, "dt_nasc", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Dependente.prototype, "nm_mae", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Dependente.prototype, "cd_associado_d", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Dependente.prototype, "id_sexo_d", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Dependente.prototype, "id_parentesco_d", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Dependente.prototype, "cd_status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Dependente.prototype, "nu_vl_mensalidade", void 0);
exports.default = Dependente;
//# sourceMappingURL=TbDependente.js.map