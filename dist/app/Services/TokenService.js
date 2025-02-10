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
const TbTokenIdParc_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbTokenIdParc"));
class TokenService {
    isTokenValido(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const tok = yield TbTokenIdParc_1.default.query().where('cd_Codtokenidparc', token).first();
            return !!tok;
        });
    }
    findTokenParceiroIndividual(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenIdParc = yield TbTokenIdParc_1.default
                .query()
                .preload('parceiro', (query) => {
                query.preload('produtoComercial', (query) => {
                    query.preload('categoria')
                        .preload('formasPagamentoIndividual', (query => {
                        query.preload('meioPagamentoIndividual');
                    }));
                });
            })
                .preload('vendedor')
                .preload('corretora')
                .where('cd_Codtokenidparc', token)
                .first();
            return tokenIdParc || new TbTokenIdParc_1.default;
        });
    }
    findTokenParceiroEmpresa(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenIdParc = yield TbTokenIdParc_1.default
                .query()
                .preload('parceiro', (query) => {
                query.preload('produtoComercial', (query) => {
                    query.preload('categoria')
                        .preload('produtoS4E')
                        .preload('formasPagamentoEmpresa', (query => {
                        query.preload('meioPagamentoEmpresa');
                    }));
                });
            })
                .preload('vendedor')
                .preload('corretora')
                .where('cd_Codtokenidparc', token)
                .first();
            return tokenIdParc || new TbTokenIdParc_1.default;
        });
    }
}
exports.default = TokenService;
//# sourceMappingURL=TokenService.js.map