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
const axios_1 = __importDefault(require("axios"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
class AssertivaService {
    constructor() {
        this.urlBaseAssertiva = Env_1.default.get('ASSERTIVA_BASE_URL');
        this.userAssertiva = Env_1.default.get('ASSERTIVA_USER');
    }
    getAssertivaToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(`${this.urlBaseAssertiva}/oauth2/v3/token?grant_type=client_credentials`, {}, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json',
                        'Authorization': `${this.userAssertiva}`,
                    },
                });
                if (response.status === 200) {
                    return response.data;
                }
                else {
                    return false;
                }
            }
            catch (erro) {
                return false;
            }
        });
    }
    getAssertivaCPFDetails(cpf) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield this.getAssertivaToken();
                const response = yield axios_1.default.get(`${this.urlBaseAssertiva}/localize/v3/cpf?cpf=${cpf}&idFinalidade=1`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + `${token.access_token}`,
                    },
                });
                if (response.status === 200) {
                    return response.data;
                }
                else {
                    return false;
                }
            }
            catch (erro) {
                return false;
            }
        });
    }
}
exports.default = AssertivaService;
//# sourceMappingURL=AssertivaService.js.map