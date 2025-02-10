"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserAdmin_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserAdmin"));
const bcrypt = require('bcrypt');
class AuthenticationService {
    login(auth, cpf, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserAdmin_1.default.query().where('cpf', cpf).firstOrFail();
            if (!(yield bcrypt.compare(password, user.password))) {
                throw new Error('Invalid credentials');
            }
            const token = yield auth.use('api').generate(user, {
                expiresIn: '1 day'
            });
            return token;
        });
    }
    logout(auth) {
        return __awaiter(this, void 0, void 0, function* () {
            yield auth.use('api').revoke();
            return {
                revoked: true
            };
        });
    }
}
exports.default = AuthenticationService;
//# sourceMappingURL=AuthenticationService.js.map