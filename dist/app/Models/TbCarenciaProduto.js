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
const TbCarencia_1 = __importDefault(require("./TbCarencia"));
class TbCarenciaProduto extends Orm_1.BaseModel {
}
TbCarenciaProduto.table = "tb_carenciaprod";
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], TbCarenciaProduto.prototype, "id_carenciaprod", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbCarenciaProduto.prototype, "id_carencia_pr", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TbCarenciaProduto.prototype, "id_prodcomerc_pr", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TbCarenciaProduto.prototype, "nu_status", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => TbCarencia_1.default, {
        foreignKey: 'id_carencia_pr'
    }),
    __metadata("design:type", Object)
], TbCarenciaProduto.prototype, "carencia", void 0);
exports.default = TbCarenciaProduto;
//# sourceMappingURL=TbCarenciaProduto.js.map