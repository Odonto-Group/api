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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthenticationService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/AuthenticationService"));
const fold_1 = require("@adonisjs/fold");
const LoginValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/LoginValidator"));
let AuthenticationController = class AuthenticationController {
    constructor(authenticationService) {
        this.authenticationService = authenticationService;
    }
    login({ request, response, auth }) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield request.validate(LoginValidator_1.default);
            const cpf = data.cpf;
            const password = data.password;
            try {
                const token = yield this.authenticationService.login(auth, cpf, password);
                return token;
            }
            catch (error) {
                return response.unauthorized(error.message);
            }
        });
    }
    logout({ response, auth }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authenticationService.logout(auth);
            return response.ok({ revoked: true });
        });
    }
};
AuthenticationController = __decorate([
    (0, fold_1.inject)(),
    __metadata("design:paramtypes", [AuthenticationService_1.default])
], AuthenticationController);
exports.default = AuthenticationController;
//# sourceMappingURL=AuthenticationController.js.map