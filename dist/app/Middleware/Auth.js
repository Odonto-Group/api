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
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/auth/build/standalone");
class AuthMiddleware {
    constructor() {
        this.redirectTo = '/login';
    }
    authenticate(auth, guards) {
        return __awaiter(this, void 0, void 0, function* () {
            let guardLastAttempted;
            for (let guard of guards) {
                guardLastAttempted = guard;
                if (yield auth.use(guard).check()) {
                    auth.defaultGuard = guard;
                    return true;
                }
            }
            throw new standalone_1.AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS', guardLastAttempted, this.redirectTo);
        });
    }
    handle({ auth }, next, customGuards) {
        return __awaiter(this, void 0, void 0, function* () {
            const guards = customGuards.length ? customGuards : [auth.name];
            yield this.authenticate(auth, guards);
            yield next();
        });
    }
}
exports.default = AuthMiddleware;
//# sourceMappingURL=Auth.js.map