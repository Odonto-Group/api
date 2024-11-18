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
const TbCarenciaProduto_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbCarenciaProduto"));
class CarenciaProdutoService {
    buscarCarencia(idProduto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield TbCarenciaProduto_1.default.query()
                .preload('carencia')
                .leftJoin('tb_carencia', 'tb_carenciaprod.id_carencia_pr', '=', 'tb_carencia.id_carencia')
                .where('tb_carenciaprod.id_prodcomerc_pr', idProduto);
        });
    }
}
exports.default = CarenciaProdutoService;
//# sourceMappingURL=CarenciaProdutoService.js.map