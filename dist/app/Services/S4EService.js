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
const ErroInclusaoAssociadoS4EException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/ErroInclusaoAssociadoS4EException"));
let S4EService = class S4EService {
    constructor() {
        this.s4eInclude = Env_1.default.get('S4E_URL_INCLUSAO');
        this.s4eToken = Env_1.default.get('SE4_TOKEN');
    }
    includeAssociado(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(`${this.s4eInclude}`, body, {
                    headers: {
                        'token': `${this.s4eToken}`,
                    },
                });
                if (response.status === 200) {
                    return response.data;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                throw new ErroInclusaoAssociadoS4EException_1.default();
            }
        });
    }
};
S4EService = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [])
], S4EService);
exports.default = S4EService;
//# sourceMappingURL=S4EService.js.map