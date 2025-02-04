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
class ApiViaMaisService {
    constructor() {
        this.http = axios_1.default.create({
            baseURL: Env_1.default.get('URL_API_VIA_MAIS'),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Env_1.default.get('TOKEN_API_VIA_MAIS')}`
            },
        });
    }
    sendLead(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                name: data.nome,
                phone_number: data.telefone,
                source: data.origem,
            };
            const result = yield this.http.post('', body);
            if (result.data.message != "Success") {
                throw new Error("error sending data " + JSON.stringify(result.data));
            }
            return result.data;
        });
    }
}
exports.default = ApiViaMaisService;
//# sourceMappingURL=ApiViaMaisService.js.map