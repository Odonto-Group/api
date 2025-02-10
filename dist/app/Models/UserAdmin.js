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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const bcrypt = require('bcrypt');
class UserAdmin extends Orm_1.BaseModel {
    static hashPassword(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.$dirty.password) {
                user.password = yield bcrypt.hash(user.password, 10);
            }
        });
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], UserAdmin.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserAdmin.prototype, "email", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserAdmin.prototype, "cpf", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserAdmin.prototype, "name", void 0);
__decorate([
    (0, Orm_1.column)({ serializeAs: null }),
    __metadata("design:type", String)
], UserAdmin.prototype, "password", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], UserAdmin.prototype, "rememberMeToken", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], UserAdmin.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], UserAdmin.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.beforeSave)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserAdmin]),
    __metadata("design:returntype", Promise)
], UserAdmin, "hashPassword", null);
exports.default = UserAdmin;
//# sourceMappingURL=UserAdmin.js.map