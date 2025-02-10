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
const axios_1 = __importDefault(require("axios"));
const standalone_1 = require("@adonisjs/core/build/standalone");
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
let P4XService = class P4XService {
    constructor() {
        this.usuario = Env_1.default.get('USUARIO_P4X');
        this.senha = Env_1.default.get('SENHA_P4X');
        this.urlBaseP4x = Env_1.default.get('URL_BASE_P4X');
    }
    geraPagamentoP4XBoleto(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield this.geraToken();
                const response = yield axios_1.default.post(`${this.urlBaseP4x}/boletos`, body, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
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
    geraPagamentoP4XCartaoCredito(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield this.geraToken();
                const linkPagamentoCartao = `${this.urlBaseP4x}/pagamentos/cartaocredito`;
                const response = yield axios_1.default.post(linkPagamentoCartao, body, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
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
                console.log(erro);
                return false;
            }
        });
    }
    geraToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                usuario: this.usuario,
                senha: this.senha
            };
            try {
                const response = yield axios_1.default.post(`${this.urlBaseP4x}/conta/token`, body, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.status === 200) {
                    const result = response.data;
                    return result.token;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                return null;
            }
        });
    }
};
P4XService = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [])
], P4XService);
exports.default = P4XService;
//# sourceMappingURL=P4XService.js.map