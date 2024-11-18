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
const TbParceiro_1 = __importDefault(require("./TbParceiro"));
const TbCorretora_1 = __importDefault(require("./TbCorretora"));
const TbVendedor_1 = __importDefault(require("./TbVendedor"));
class TbTokenIdParc extends Orm_1.BaseModel {
}
TbTokenIdParc.table = 'tb_tokenidparc';
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbTokenIdParc.prototype, "id_tokenidparc", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'nu_cdVendedor4E_tk' }),
    __metadata("design:type", Number)
], TbTokenIdParc.prototype, "nu_cdVendedor4E_tk", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'nu_cdCorretoraS4E_tk' }),
    __metadata("design:type", Number)
], TbTokenIdParc.prototype, "nu_cdCorretoraS4E_tk", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'nu_IdParceiro_tk' }),
    __metadata("design:type", Number)
], TbTokenIdParc.prototype, "nu_IdParceiro_tk", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbTokenIdParc.prototype, "cd_Codtokenidparc", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbTokenIdParc.prototype, "short_url_apresentacao", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbTokenIdParc.prototype, "short_url_checkout", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbTokenIdParc.prototype, "short_url_vendedor", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbTokenIdParc.prototype, "status_token", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbTokenIdParc.prototype, "tknAtualizado", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => TbParceiro_1.default, {
        foreignKey: 'nu_IdParceiro_tk'
    }),
    __metadata("design:type", Object)
], TbTokenIdParc.prototype, "parceiro", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => TbCorretora_1.default, {
        foreignKey: 'nu_cdCorretoraS4E_tk'
    }),
    __metadata("design:type", Object)
], TbTokenIdParc.prototype, "corretora", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => TbVendedor_1.default, {
        foreignKey: 'nu_cdVendedor4E_tk',
        localKey: 'nu_cdVendedorS4E'
    }),
    __metadata("design:type", Object)
], TbTokenIdParc.prototype, "vendedor", void 0);
exports.default = TbTokenIdParc;
//# sourceMappingURL=TbTokenIdParc.js.map