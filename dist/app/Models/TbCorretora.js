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
const TbTokenIdParc_1 = __importDefault(require("./TbTokenIdParc"));
class TbCorretora extends Orm_1.BaseModel {
}
TbCorretora.table = "tb_corretora";
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], TbCorretora.prototype, "id_corretora", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbCorretora.prototype, "nm_razao_social", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbCorretora.prototype, "nu_cnpj", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbCorretora.prototype, "nu_CdCorretoraEasy", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbCorretora.prototype, "nu_CdCorretoraS4E", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbCorretora.prototype, "nu_status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbCorretora.prototype, "nu_cdequipe", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbCorretora.prototype, "tx_UF", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => TbTokenIdParc_1.default),
    __metadata("design:type", Object)
], TbCorretora.prototype, "tokenidparc", void 0);
exports.default = TbCorretora;
//# sourceMappingURL=TbCorretora.js.map