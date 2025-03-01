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
const luxon_1 = require("luxon");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const TbLeadStatus_1 = __importDefault(require("./TbLeadStatus"));
class TbLeads extends Orm_1.BaseModel {
}
TbLeads.table = 'tb_leads';
TbLeads.primaryKey = 'id_leads';
__decorate([
    (0, Orm_1.column)({ isPrimary: true, }),
    __metadata("design:type", Number)
], TbLeads.prototype, "id_leads", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbLeads.prototype, "nome", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbLeads.prototype, "email", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbLeads.prototype, "telefone", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbLeads.prototype, "origem", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], TbLeads.prototype, "data", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], TbLeads.prototype, "enviou", void 0);
__decorate([
    Orm_1.column.date(),
    __metadata("design:type", luxon_1.DateTime)
], TbLeads.prototype, "data_nascimento", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbLeads.prototype, "cpf", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbLeads.prototype, "cep", void 0);
__decorate([
    (0, Orm_1.manyToMany)(() => TbLeadStatus_1.default, {
        localKey: 'id_leads',
        relatedKey: 'id',
        pivotTable: 'tb_log_leads_status_sec',
        pivotForeignKey: 'id_lead',
        pivotRelatedForeignKey: 'id_status',
    }),
    __metadata("design:type", Object)
], TbLeads.prototype, "statusLeadsSecundario", void 0);
__decorate([
    (0, Orm_1.manyToMany)(() => TbLeadStatus_1.default, {
        localKey: 'id_leads',
        relatedKey: 'id',
        pivotTable: 'tb_log_leads_status_prim',
        pivotForeignKey: 'id_lead',
        pivotRelatedForeignKey: 'id_status',
    }),
    __metadata("design:type", Object)
], TbLeads.prototype, "statusLeadsPrimario", void 0);
exports.default = TbLeads;
//# sourceMappingURL=TbLeads.js.map