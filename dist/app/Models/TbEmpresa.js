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
const TbProdutoComercial_1 = __importDefault(require("./TbProdutoComercial"));
class TbEmpresa extends Orm_1.BaseModel {
}
TbEmpresa.table = 'tb_empresa';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], TbEmpresa.prototype, "id_cdempresa", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "cd_codcontratoS4E" }),
    __metadata("design:type", Number)
], TbEmpresa.prototype, "cd_codcontratoS4E", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbEmpresa.prototype, "nm_razao_social", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbEmpresa.prototype, "nm_nome_fantasia", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbEmpresa.prototype, "nu_cnpj", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbEmpresa.prototype, "nu_inscricao_estadual", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbEmpresa.prototype, "nu_qtd_funcionarios", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbEmpresa.prototype, "nm_responsavel", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbEmpresa.prototype, "nu_cpf_resp", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbEmpresa.prototype, "ds_email", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbEmpresa.prototype, "nu_dddfixo1", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbEmpresa.prototype, "nu_telfixo1", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbEmpresa.prototype, "nu_dddfixo2", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbEmpresa.prototype, "nu_telfixo2", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbEmpresa.prototype, "nu_dddcel", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbEmpresa.prototype, "nu_celular", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "DT_CADASTRO" }),
    __metadata("design:type", String)
], TbEmpresa.prototype, "DT_CADASTRO", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbEmpresa.prototype, "id_vendedor_e", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbEmpresa.prototype, "nu_diavencimento", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbEmpresa.prototype, "id_prodcomerc_e", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbEmpresa.prototype, "dt_dataprimvenc", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nu_CEP" }),
    __metadata("design:type", String)
], TbEmpresa.prototype, "nu_CEP", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_EndLograd" }),
    __metadata("design:type", String)
], TbEmpresa.prototype, "tx_EndLograd", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_EndNumero" }),
    __metadata("design:type", String)
], TbEmpresa.prototype, "tx_EndNumero", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_EndCompl" }),
    __metadata("design:type", String)
], TbEmpresa.prototype, "tx_EndCompl", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_EndBairro" }),
    __metadata("design:type", String)
], TbEmpresa.prototype, "tx_EndBairro", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_EndCidade" }),
    __metadata("design:type", String)
], TbEmpresa.prototype, "tx_EndCidade", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "id_UF_e" }),
    __metadata("design:type", Number)
], TbEmpresa.prototype, "id_UF_e", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbEmpresa.prototype, "tx_nmarqimport", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbEmpresa.prototype, "cd_status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbEmpresa.prototype, "cd_patrocinio_e", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbEmpresa.prototype, "nr_proposta", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "id_origemVenda" }),
    __metadata("design:type", Number)
], TbEmpresa.prototype, "id_origemVenda", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbEmpresa.prototype, "dt_alteraStatus", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbEmpresa.prototype, "nu_vl_mensalidade", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => TbProdutoComercial_1.default, {
        foreignKey: "id_prodcomerc_e"
    }),
    __metadata("design:type", Object)
], TbEmpresa.prototype, "produtoComercial", void 0);
exports.default = TbEmpresa;
//# sourceMappingURL=TbEmpresa.js.map