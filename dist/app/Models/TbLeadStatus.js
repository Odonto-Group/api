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
const TbLeads_1 = __importDefault(require("./TbLeads"));
class StatusLeads extends Orm_1.BaseModel {
}
StatusLeads.table = 'tb_leads_status';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], StatusLeads.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], StatusLeads.prototype, "descricao", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], StatusLeads.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], StatusLeads.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.manyToMany)(() => TbLeads_1.default, {
        localKey: 'id',
        relatedKey: 'id_leads',
        pivotTable: 'tb_log_leads_status_sec',
        pivotForeignKey: 'id_status',
        pivotRelatedForeignKey: 'id_lead',
    }),
    __metadata("design:type", Object)
], StatusLeads.prototype, "leads", void 0);
exports.default = StatusLeads;
//# sourceMappingURL=TbLeadStatus.js.map