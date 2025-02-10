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
class TbFuncionario extends Orm_1.BaseModel {
}
TbFuncionario.table = 'tb_funcionario';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], TbFuncionario.prototype, "id_funcionario", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbFuncionario.prototype, "id_cdempresa_f", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbFuncionario.prototype, "nm_funcionario", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbFuncionario.prototype, "nu_cpf", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbFuncionario.prototype, "nu_cns", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbFuncionario.prototype, "nu_rg", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbFuncionario.prototype, "ds_orgao_expedidor", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbFuncionario.prototype, "dt_nascimento", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbFuncionario.prototype, "id_sexo_f", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbFuncionario.prototype, "id_parentesco_f", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbFuncionario.prototype, "nm_mae", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbFuncionario.prototype, "nu_dddfixo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbFuncionario.prototype, "nu_telefone", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbFuncionario.prototype, "nu_dddcelular", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbFuncionario.prototype, "nu_celular", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbFuncionario.prototype, "ds_email", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbFuncionario.prototype, "id_prodcomerc_f", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "DT_CADASTRO" }),
    __metadata("design:type", String)
], TbFuncionario.prototype, "DT_CADASTRO", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbFuncionario.prototype, "tipo_plano", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "cd_codcontratoS4E" }),
    __metadata("design:type", Number)
], TbFuncionario.prototype, "cd_codcontratoS4E", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbFuncionario.prototype, "nu_matriculafuncional", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbFuncionario.prototype, "id_uf_f", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nu_CEP" }),
    __metadata("design:type", String)
], TbFuncionario.prototype, "nu_CEP", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_EndLograd" }),
    __metadata("design:type", String)
], TbFuncionario.prototype, "tx_EndLograd", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_EndNumero" }),
    __metadata("design:type", String)
], TbFuncionario.prototype, "tx_EndNumero", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_EndCompl" }),
    __metadata("design:type", String)
], TbFuncionario.prototype, "tx_EndCompl", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_EndBairro" }),
    __metadata("design:type", String)
], TbFuncionario.prototype, "tx_EndBairro", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_EndCidade" }),
    __metadata("design:type", String)
], TbFuncionario.prototype, "tx_EndCidade", void 0);
exports.default = TbFuncionario;
//# sourceMappingURL=TbFuncionario.js.map