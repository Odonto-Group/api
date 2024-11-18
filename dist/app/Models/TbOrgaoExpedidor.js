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
class TbOrgaoExpedidor extends Orm_1.BaseModel {
}
TbOrgaoExpedidor.table = 'tb_orgaoExpedidor';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], TbOrgaoExpedidor.prototype, "id_oe", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], TbOrgaoExpedidor.prototype, "nm_orgaoexpedidor", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], TbOrgaoExpedidor.prototype, "sigla", void 0);
exports.default = TbOrgaoExpedidor;
//# sourceMappingURL=TbOrgaoExpedidor.js.map