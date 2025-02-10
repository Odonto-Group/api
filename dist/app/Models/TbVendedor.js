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
class TbVendedor extends Orm_1.BaseModel {
}
TbVendedor.table = "tb_vendedor";
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], TbVendedor.prototype, "id_vendedor", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbVendedor.prototype, "tx_nome", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbVendedor.prototype, "nu_cpf", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbVendedor.prototype, "nu_cdVendedorEasy", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: "nu_cdVendedorS4E" }),
    __metadata("design:type", Number)
], TbVendedor.prototype, "nu_cdVendedorS4E", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbVendedor.prototype, "nu_idParceiro", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbVendedor.prototype, "id_Corretorav", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbVendedor.prototype, "nu_dddcel", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbVendedor.prototype, "nu_telcelular", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbVendedor.prototype, "ds_email", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbVendedor.prototype, "en_status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbVendedor.prototype, "foto_vendedor", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], TbVendedor.prototype, "bl_ativo", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => TbTokenIdParc_1.default),
    __metadata("design:type", Object)
], TbVendedor.prototype, "tokenidparc", void 0);
exports.default = TbVendedor;
//# sourceMappingURL=TbVendedor.js.map