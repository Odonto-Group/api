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
const TbResponsavelFinanceiro_1 = __importDefault(require("./TbResponsavelFinanceiro"));
class TbAssociado extends Orm_1.BaseModel {
    setOrgaoExpedidor(orgao_expedidor, orgao_expedidor_uf) {
        this.ds_OrgaoExpedidor = orgao_expedidor + '-' + orgao_expedidor_uf;
    }
    setCelularAttribute(value) {
        value = value ? value.replace(/\D/g, "") : "00000000000";
        this.nu_dddCel = value.substring(0, 2);
        this.nu_Celular = value.substring(2, 11);
    }
}
TbAssociado.table = 'tb_associado';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], TbAssociado.prototype, "id_associado", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbAssociado.prototype, "nm_associado", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbAssociado.prototype, "nm_mae", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbAssociado.prototype, "nu_cpf", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbAssociado.prototype, "nu_cns", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbAssociado.prototype, "nu_rg", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "ds_OrgaoExpedidor" }),
    __metadata("design:type", String)
], TbAssociado.prototype, "ds_OrgaoExpedidor", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbAssociado.prototype, "dt_nasc", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbAssociado.prototype, "ds_email", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbAssociado.prototype, "id_sexo_a", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "id_EstadoCivil_a" }),
    __metadata("design:type", Number)
], TbAssociado.prototype, "id_EstadoCivil_a", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nu_codprodutoS4E" }),
    __metadata("design:type", Number)
], TbAssociado.prototype, "nu_codprodutoS4E", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "cd_CodContratoS4E" }),
    __metadata("design:type", Number)
], TbAssociado.prototype, "cd_CodContratoS4E", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nu_CodDeptoEmpS4E" }),
    __metadata("design:type", Number)
], TbAssociado.prototype, "nu_CodDeptoEmpS4E", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbAssociado.prototype, "id_prodcomerc_a", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbAssociado.prototype, "dt_dia_vencto", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbAssociado.prototype, "nu_dddtelfixo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbAssociado.prototype, "nu_telefixo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbAssociado.prototype, "nu_ramaltelfixo", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nu_dddCel" }),
    __metadata("design:type", String)
], TbAssociado.prototype, "nu_dddCel", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbAssociado.prototype, "nu_Celular", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbAssociado.prototype, "nu_tipo_servidor", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbAssociado.prototype, "nu_vl_mensalidade", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbAssociado.prototype, "dt_operacao", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbAssociado.prototype, "dt_inicio_vigencia", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbAssociado.prototype, "nu_motivo_cancelamento", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbAssociado.prototype, "id_meiopagto_a", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "id_FontePag_a" }),
    __metadata("design:type", Number)
], TbAssociado.prototype, "id_FontePag_a", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbAssociado.prototype, "id_orgao_a", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbAssociado.prototype, "cd_perfil", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nu_MatriculaFuncional" }),
    __metadata("design:type", String)
], TbAssociado.prototype, "nu_MatriculaFuncional", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_Cargo" }),
    __metadata("design:type", String)
], TbAssociado.prototype, "tx_Cargo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbAssociado.prototype, "tx_lotacao", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbAssociado.prototype, "cd_situacao", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbAssociado.prototype, "dt_Cadastro", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbAssociado.prototype, "cd_status", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "dt_alteraStatus" }),
    __metadata("design:type", String)
], TbAssociado.prototype, "dt_alteraStatus", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbAssociado.prototype, "cd_entidade", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbAssociado.prototype, "cd_modulo", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbAssociado.prototype, "id_vendedor_a", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbAssociado.prototype, "id_parentesco_a", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbAssociado.prototype, "nu_CEP", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_EndLograd" }),
    __metadata("design:type", String)
], TbAssociado.prototype, "tx_EndLograd", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nu_EndNumero" }),
    __metadata("design:type", String)
], TbAssociado.prototype, "nu_EndNumero", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_EndCompl" }),
    __metadata("design:type", String)
], TbAssociado.prototype, "tx_EndCompl", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_EndBairro" }),
    __metadata("design:type", String)
], TbAssociado.prototype, "tx_EndBairro", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "tx_EndCidade" }),
    __metadata("design:type", String)
], TbAssociado.prototype, "tx_EndCidade", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'id_UF_a' }),
    __metadata("design:type", Number)
], TbAssociado.prototype, "id_UF_a", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbAssociado.prototype, "st_mail", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nu_cpfAdesionista" }),
    __metadata("design:type", String)
], TbAssociado.prototype, "nu_cpfAdesionista", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "st_sitProp" }),
    __metadata("design:type", String)
], TbAssociado.prototype, "st_sitProp", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbAssociado.prototype, "nr_proposta", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "id_origemVenda" }),
    __metadata("design:type", Number)
], TbAssociado.prototype, "id_origemVenda", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbAssociado.prototype, "dt_dataprimvenc", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => TbResponsavelFinanceiro_1.default, {
        foreignKey: 'id_associado_rf',
        localKey: 'id_associado'
    }),
    __metadata("design:type", Object)
], TbAssociado.prototype, "responsavelFinanceiro", void 0);
exports.default = TbAssociado;
//# sourceMappingURL=TbAssociado.js.map