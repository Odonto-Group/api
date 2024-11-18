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
const TbFormasPagamentoIndividual_1 = __importDefault(require("./TbFormasPagamentoIndividual"));
const TbFormasPagamentoEmpresa_1 = __importDefault(require("./TbFormasPagamentoEmpresa"));
class CarenciaProduto extends Orm_1.BaseModel {
}
CarenciaProduto.table = 'tb_meiopagto';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], CarenciaProduto.prototype, "id_meiopagto", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], CarenciaProduto.prototype, "cd_codmeiopagto", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CarenciaProduto.prototype, "nm_meiopagto", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], CarenciaProduto.prototype, "cd_gmeiopagto", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], CarenciaProduto.prototype, "nu_status", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => TbFormasPagamentoIndividual_1.default, {
        foreignKey: 'id_prodcomerc_if',
    }),
    __metadata("design:type", Object)
], CarenciaProduto.prototype, "formasPagamentoIndividual", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => TbFormasPagamentoEmpresa_1.default, {
        foreignKey: 'id_prodcomerc_fc',
    }),
    __metadata("design:type", Object)
], CarenciaProduto.prototype, "formasPagamentoEmpresa", void 0);
exports.default = CarenciaProduto;
//# sourceMappingURL=TbMeioPagamento.js.map